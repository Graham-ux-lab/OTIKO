import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { EventStatusDto } from './dto';

const eventSelect = {
  id: true,
  title: true,
  status: true,
  startDate: true,
  location: true,
  venue: true,
  category: { select: { name: true } },
  organizer: { select: { organizationName: true } },
  _count: { select: { ticketTypes: true, orders: true } },
} as const;

@Controller('admin/events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminEventsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  index() {
    return this.prisma.event.findMany({ orderBy: { startDate: 'desc' }, select: eventSelect });
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: EventStatusDto) {
    return this.prisma.event.update({ where: { id }, data: { status: dto.status } });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}
