import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { CurrentUser } from './current-user.decorator';

const orderInclude = {
  event: { select: { id: true, title: true, organizerId: true } },
  user: { select: { id: true, name: true, email: true } },
  items: { select: { id: true, quantity: true, unitPrice: true, totalPrice: true } },
} as const;

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('admin')
  @Roles('ADMIN')
  adminIndex() {
    return this.prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: orderInclude });
  }

  @Get('organizer')
  @Roles('ORGANIZER')
  async organizerIndex(@CurrentUser() user: { id: string }) {
    const profile = await this.prisma.organizerProfile.findUnique({ where: { userId: user.id } });
    if (!profile) throw new NotFoundException('Organizer profile not found');
    const events = await this.prisma.event.findMany({ where: { organizerId: profile.id }, select: { id: true } });
    const eventIds = events.map((event) => event.id);
    return this.prisma.order.findMany({ where: { eventId: { in: eventIds } }, orderBy: { createdAt: 'desc' }, include: orderInclude });
  }

  @Get('my')
  async myOrders(@CurrentUser() user: { id: string }) {
    return this.prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: orderInclude,
    });
  }
}
