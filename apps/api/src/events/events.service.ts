import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { search, category, location, sortBy } = query;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { venue: { contains: search } },
      ];
    }

    if (category) {
      where.category = { name: category };
    }

    if (location) {
      where.location = { contains: location };
    }

    const orderBy: any =
      sortBy === 'price-low' || sortBy === 'price-high'
        ? { startDate: 'asc' }
        : { startDate: 'asc' };

    return this.prisma.event.findMany({
      where,
      include: {
        category: true,
        organizer: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        ticketTypes: {
          orderBy: { price: 'asc' },
        },
        _count: {
          select: { tickets: true },
        },
      },
      orderBy,
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        ticketTypes: {
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async create(organizerId: string, dto: CreateEventDto) {
    const { ticketTypes, ...eventData } = dto;

    this.logger.log(`Creating event for organizer ${organizerId}`);

    return this.prisma.event.create({
      data: {
        ...eventData,
        organizerId,
        status: 'DRAFT',
        ticketTypes: {
          create: ticketTypes.map((t) => ({
            name: t.name,
            price: t.price,
            quantity: t.quantity,
            salesStart: t.salesStart ? new Date(t.salesStart) : new Date(dto.startDate),
            salesEnd: t.salesEnd ? new Date(t.salesEnd) : new Date(dto.endDate),
          })),
        },
      },
      include: {
        ticketTypes: true,
        category: true,
      },
    });
  }

  async update(id: string, organizerId: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findFirst({
      where: { id, organizerId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: { id },
      data: dto,
    });
  }

  async publish(id: string, organizerId: string, organizerStatus: string) {
    if (organizerStatus !== 'VERIFIED') {
      throw new ForbiddenException(
        'Your organizer account must be verified before you can publish events.',
      );
    }

    const event = await this.prisma.event.findFirst({
      where: { id, organizerId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }

  async setStatus(id: string, organizerId: string, status: string, organizerStatus: string) {
    if (status === 'PUBLISHED' && organizerStatus !== 'VERIFIED') {
      throw new ForbiddenException('Your organizer account must be verified before you can publish events.');
    }
    const event = await this.prisma.event.findFirst({ where: { id, organizerId }, select: { id: true } });
    if (!event) throw new NotFoundException('Event not found');
    return this.prisma.event.update({ where: { id }, data: { status } });
  }

  async remove(id: string, organizerId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id, organizerId },
      select: { id: true, _count: { select: { orders: true, tickets: true, checkIns: true } } },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event._count.orders || event._count.tickets || event._count.checkIns) {
      return this.prisma.event.update({ where: { id }, data: { status: 'CANCELLED' } });
    }
    return this.prisma.$transaction(async (tx) => {
      await tx.ticketType.deleteMany({ where: { eventId: id } });
      return tx.event.delete({ where: { id } });
    });
  }

  async findMyEvents(organizerId: string) {
    return this.prisma.event.findMany({
      where: { organizerId },
      include: {
        category: true,
        ticketTypes: true,
        _count: {
          select: { tickets: true, orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
