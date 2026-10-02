import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('admin/orders')
  @Roles('ADMIN')
  async adminOrders() {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        event: { select: { id: true, title: true } },
        items: { select: { id: true, ticketTypeId: true, quantity: true, unitPrice: true, totalPrice: true } },
      },
    });
    return orders.map(({ customerName, customerEmail, ...order }) => ({
      ...order,
      user: { name: customerName, email: customerEmail },
    }));
  }

  @Get('orders/organizer')
  @Roles('ORGANIZER')
  async organizerOrders(@CurrentUser() user: { id: string }) {
    const profile = await this.prisma.organizerProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (!profile) throw new NotFoundException('Organizer profile not found');
    const orders = await this.prisma.order.findMany({
      where: { event: { organizerId: profile.id } },
      include: { event: { select: { id: true, title: true } }, items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(({ customerName, customerEmail, customerPhone, ...order }) => ({
      ...order,
      user: { name: customerName, email: customerEmail },
    }));
  }

  @Get('orders/my')
  @Roles('CUSTOMER')
  async myOrders(@CurrentUser() user: { email: string }) {
    const orders = await this.prisma.order.findMany({
      where: { customerEmail: user.email },
      include: { event: { select: { id: true, title: true } }, items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(({ customerName, customerEmail, customerPhone, ...order }) => ({
      ...order,
      user: { name: customerName, email: customerEmail },
    }));
  }
}
