import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from './prisma.service';

const eventSelection = {
  id: true,
  title: true,
  description: true,
  posterUrl: true,
  startDate: true,
  endDate: true,
  venue: true,
  location: true,
  category: { select: { name: true, slug: true } },
  ticketTypes: { select: { id: true, name: true, price: true, quantity: true, soldQuantity: true } },
} as const;

@Controller('events')
export class EventsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findPublished() {
    return this.prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      select: eventSelection,
      orderBy: { startDate: 'asc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.prisma.event.findFirst({
      where: { id, status: 'PUBLISHED' },
      select: eventSelection,
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }
}
