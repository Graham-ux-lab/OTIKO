import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { CurrentUser } from './current-user.decorator';

@Controller('orders/organizer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ORGANIZER')
export class OrganizerOrdersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async index(@CurrentUser() user: { id: string }) {
    const organizer = await this.prisma.organizerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!organizer) throw new NotFoundException('Organizer profile not found');

    const orders = await this.prisma.order.findMany({
      where: { event: { organizerId: organizer.id } },
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
