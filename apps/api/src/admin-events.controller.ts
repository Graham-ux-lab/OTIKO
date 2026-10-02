import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { EventStatusDto } from './dto';

@Controller('admin/events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminEventsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  index() {
    return this.prisma.event.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        category: { select: { name: true } },
        organizer: { select: { organizationName: true } },
        _count: { select: { ticketTypes: true, orders: true } },
      },
    });
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: EventStatusDto) {
    if (dto.status === 'PUBLISHED') throw new BadRequestException('Use the publish action to publish an event');
    return this.prisma.event.update({ where: { id }, data: { status: dto.status } });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: { id: true, _count: { select: { orders: true, tickets: true, checkIns: true } } },
    });
    if (!event) throw new NotFoundException('Event not found');

    if (event._count.orders || event._count.tickets || event._count.checkIns) {
      return this.prisma.event.update({ where: { id }, data: { status: 'CANCELLED' } });
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.ticketType.deleteMany({ where: { eventId: id } });
      return tx.event.delete({ where: { id } });
    });
  }
}
