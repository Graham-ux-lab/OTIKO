import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminOrdersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async index() {
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
}
