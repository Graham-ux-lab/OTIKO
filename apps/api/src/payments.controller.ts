import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from './prisma.service';
import { CheckoutDto } from './payments.dto';

type DarajaCallback = {
  Body?: { stkCallback?: {
    CheckoutRequestID?: string;
    ResultCode?: number;
    CallbackMetadata?: { Item?: { Name: string; Value?: string | number }[] };
  } };
};

@Controller('payments')
export class PaymentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('checkout')
  async checkout(@Body() dto: CheckoutDto) {
    const config = this.mpesaConfig();
    const event = await this.prisma.event.findFirst({
      where: { id: dto.eventId, status: 'PUBLISHED' },
      select: { id: true, title: true, ticketTypes: { where: { id: dto.ticketTypeId }, take: 1 } },
    });
    const ticketType = event?.ticketTypes[0];
    if (!event || !ticketType) throw new NotFoundException('Event or ticket type not found');
    const amount = Math.ceil(ticketType.price);

    const orderNumber = `OTK-${randomUUID()}`;
    const order = await this.prisma.$transaction(async (tx) => {
      const reserved = await tx.ticketType.updateMany({
        where: { id: ticketType.id, soldQuantity: { lt: ticketType.quantity } },
        data: { soldQuantity: { increment: 1 } },
      });
      if (!reserved.count) throw new BadRequestException('This ticket type is sold out');

      return tx.order.create({
        data: {
          orderNumber,
          eventId: event.id,
          totalAmount: amount,
          customerName: dto.customerName.trim(),
          customerEmail: dto.customerEmail.trim().toLowerCase(),
          customerPhone: this.normalizePhone(dto.customerPhone),
          items: { create: { ticketTypeId: ticketType.id, quantity: 1, unitPrice: amount, totalPrice: amount } },
          payments: { create: { amount, provider: 'MPESA', status: 'PENDING' } },
        },
        include: { payments: true },
      });
    });

    try {
      const token = await this.getMpesaToken(config.baseUrl, config.consumerKey, config.consumerSecret);
      const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
      const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString('base64');
      const phone = this.normalizePhone(dto.customerPhone);
      const response = await fetch(`${config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BusinessShortCode: config.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phone,
          PartyB: config.shortcode,
          PhoneNumber: phone,
          CallBackURL: config.callbackUrl,
          AccountReference: orderNumber.slice(0, 12),
          TransactionDesc: `Ticket ${event.title}`.slice(0, 13),
        }),
      });
      const result = await response.json() as { CheckoutRequestID?: string; ResponseDescription?: string; errorMessage?: string };
      if (!response.ok || !result.CheckoutRequestID) throw new Error(result.errorMessage || result.ResponseDescription || 'Safaricom could not start the payment prompt');

      await this.prisma.payment.update({ where: { id: order.payments[0].id }, data: { providerRef: result.CheckoutRequestID } });
      return { orderNumber, checkoutRequestId: result.CheckoutRequestID, message: 'An M-Pesa payment prompt has been sent to your phone.' };
    } catch (error) {
      await this.releaseReservation(order.id, order.payments[0].id);
      if (error instanceof ServiceUnavailableException) throw error;
      throw new BadRequestException(error instanceof Error ? error.message : 'Could not start M-Pesa payment');
    }
  }

  @Post('webhook')
  async webhook(@Body() payload: DarajaCallback) {
    const callback = payload?.Body?.stkCallback;
    if (!callback?.CheckoutRequestID || typeof callback.ResultCode !== 'number') return { ResultCode: 0, ResultDesc: 'Accepted' };

    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: callback.CheckoutRequestID },
      include: { order: { include: { items: true } } },
    });
    if (!payment || payment.order.status !== 'PENDING') return { ResultCode: 0, ResultDesc: 'Accepted' };

    if (callback.ResultCode !== 0) {
      await this.releaseReservation(payment.orderId, payment.id);
      return { ResultCode: 0, ResultDesc: 'Accepted' };
    }

    const metadata = callback.CallbackMetadata?.Item ?? [];
    const receipt = metadata.find((item) => item.Name === 'MpesaReceiptNumber')?.Value;
    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: payment.orderId, status: 'PENDING' }, data: { status: 'PAID' } });
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'PAID', transactionCode: receipt == null ? null : String(receipt) },
      });
      for (const item of payment.order.items) {
        await tx.ticket.createMany({
          data: Array.from({ length: item.quantity }, () => ({
            ticketNumber: `OTK-${randomUUID()}`,
            qrToken: randomUUID(),
            eventId: payment.order.eventId,
            ticketTypeId: item.ticketTypeId,
            orderId: payment.orderId,
          })),
        });
      }
    });
    return { ResultCode: 0, ResultDesc: 'Accepted' };
  }

  @Get('status/:orderNumber')
  async status(@Param('orderNumber') orderNumber: string) {
    const order = await this.prisma.order.findUnique({ where: { orderNumber }, select: { status: true } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  private async releaseReservation(orderId: string, paymentId: string) {
    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (!order || order.status !== 'PENDING') return;
      await tx.order.update({ where: { id: orderId }, data: { status: 'FAILED' } });
      await tx.payment.update({ where: { id: paymentId }, data: { status: 'FAILED' } });
      for (const item of order.items) {
        await tx.ticketType.updateMany({
          where: { id: item.ticketTypeId, soldQuantity: { gte: item.quantity } },
          data: { soldQuantity: { decrement: item.quantity } },
        });
      }
    });
  }

  private mpesaConfig() {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const passkey = process.env.MPESA_PASSKEY;
    const shortcode = process.env.MPESA_SHORTCODE;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    const callbackIsPublic = callbackUrl && /^https:\/\//i.test(callbackUrl) && !/localhost|127\.0\.0\.1/i.test(callbackUrl);
    if (!consumerKey || !consumerSecret || !passkey || !shortcode || !callbackIsPublic) {
      throw new ServiceUnavailableException('M-Pesa is not configured. Set Daraja credentials and a publicly reachable MPESA_CALLBACK_URL to accept payments.');
    }
    return {
      consumerKey,
      consumerSecret,
      passkey,
      shortcode,
      callbackUrl,
      baseUrl: process.env.MPESA_ENVIRONMENT === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke',
    };
  }

  private async getMpesaToken(baseUrl: string, consumerKey: string, consumerSecret: string) {
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${credentials}` },
    });
    const data = await response.json() as { access_token?: string; errorMessage?: string };
    if (!response.ok || !data.access_token) throw new Error(data.errorMessage || 'Could not authenticate with M-Pesa');
    return data.access_token;
  }

  private normalizePhone(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`;
    if (digits.startsWith('254') && digits.length === 12) return digits;
    if (digits.startsWith('7') && digits.length === 9) return `254${digits}`;
    throw new BadRequestException('Enter a valid Kenyan M-Pesa number');
  }
}
