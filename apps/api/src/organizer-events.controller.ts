import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { CurrentUser } from './current-user.decorator';
import { CreateEventDto, EventStatusDto } from './dto';

const eventSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  startDate: true,
  endDate: true,
  location: true,
  venue: true,
  category: { select: { id: true, name: true } },
  ticketTypes: { select: { id: true, name: true, price: true, quantity: true, soldQuantity: true } },
} as const;

@Controller('organizer/events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ORGANIZER')
export class OrganizerEventsController {
  constructor(private readonly prisma: PrismaService) {}

  private async organizerId(userId: string): Promise<string> {
    const profile = await this.prisma.organizerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Organizer profile not found');
    return profile.id;
  }

  @Get()
  async index(@CurrentUser() user: { id: string }) {
    const organizerId = await this.organizerId(user.id);
    return this.prisma.event.findMany({ where: { organizerId }, orderBy: { startDate: 'desc' }, select: eventSelect });
  }

  @Post()
  async create(@CurrentUser() user: { id: string }, @Body() dto: CreateEventDto) {
    const organizerId = await this.organizerId(user.id);
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new BadRequestException('Invalid dates');
    return this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description ?? '',
        categoryId: dto.categoryId,
        posterUrl: dto.posterUrl,
        startDate: start,
        endDate: end,
        venue: dto.venue,
        location: dto.location,
        status: 'DRAFT',
        organizerId,
        ticketTypes: {
          create: (dto.ticketTypes ?? []).map((ticket) => ({
            name: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity,
            salesStart: start,
            salesEnd: end,
          })),
        },
      },
      select: eventSelect,
    });
  }

  @Patch(':id/status')
  async setStatus(@CurrentUser() user: { id: string }, @Param('id') id: string, @Body() dto: EventStatusDto) {
    const organizerId = await this.organizerId(user.id);
    return this.prisma.event.update({ where: { id, organizerId }, data: { status: dto.status } });
  }

  @Delete(':id')
  async remove(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    const organizerId = await this.organizerId(user.id);
    return this.prisma.event.delete({ where: { id, organizerId } });
  }
}
