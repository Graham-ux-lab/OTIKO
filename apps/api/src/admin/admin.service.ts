import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getDashboard() {
    const [totalUsers, totalOrganizers, totalEvents, totalOrders, pendingApprovals, revenueAgg] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { role: 'ORGANIZER' } }),
        this.prisma.event.count(),
        this.prisma.order.count(),
        this.prisma.organizerProfile.count({ where: { status: 'PENDING' } }),
        this.prisma.payment.aggregate({
          where: { status: 'PAID' },
          _sum: { amount: true },
        }),
      ]);

    return {
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalOrders,
      pendingApprovals,
      totalRevenue: revenueAgg._sum.amount || 0,
    };
  }

  async listUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true },
    });
  }

  async setUserStatus(id: string, status: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true },
    });
  }

  async listOrganizers(status?: string) {
    const where: any = { role: 'ORGANIZER' };
    if (status) {
      where.organizerProfile = { status };
    }

    return this.prisma.user.findMany({
      where,
      include: { organizerProfile: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrganizer(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        organizerProfile: {
          include: {
            events: {
              include: {
                _count: { select: { tickets: true, orders: true } },
              },
            },
          },
        },
      },
    });

    if (!user || user.role !== 'ORGANIZER') {
      throw new NotFoundException('Organizer not found');
    }

    const { password, mfaSecret, ...safe } = user;
    return safe;
  }

  async approveOrganizer(id: string, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { organizerProfile: true },
    });

    if (!user || user.role !== 'ORGANIZER') throw new NotFoundException('Organizer not found');
    if (!user.organizerProfile) throw new BadRequestException('Organizer has no profile');
    if (user.organizerProfile.status === 'VERIFIED') throw new BadRequestException('Organizer is already verified');

    const emailSent = await this.mailService.sendOrganizerApproved(
      user.email,
      user.name,
      user.organizerProfile.organizationName,
    );
    if (!emailSent) {
      throw new BadRequestException(`Could not send the approval email to ${user.email}. Check the configured email provider settings, then try again.`);
    }

    await this.prisma.organizerProfile.update({
      where: { id: user.organizerProfile.id },
      data: { status: 'VERIFIED', approvedAt: new Date(), rejectedReason: null },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'ORGANIZER_APPROVED',
        entity: 'OrganizerProfile',
        entityId: user.organizerProfile.id,
        userId: adminId,
        details: JSON.stringify({ organizerEmail: user.email }),
      },
    });

    this.logger.log(`Organizer approved: ${user.email}`);
    return {
      message: `Organizer approved. An approval email was sent to ${user.email}.`,
      emailSent: true,
    };
  }
  async rejectOrganizer(id: string, adminId: string, reason: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { organizerProfile: true },
    });

    if (!user || user.role !== 'ORGANIZER') {
      throw new NotFoundException('Organizer not found');
    }

    if (!user.organizerProfile) {
      throw new BadRequestException('Organizer has no profile');
    }

    await this.prisma.organizerProfile.update({
      where: { id: user.organizerProfile.id },
      data: {
        status: 'REJECTED',
        rejectedReason: reason,
        approvedAt: null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'ORGANIZER_REJECTED',
        entity: 'OrganizerProfile',
        entityId: user.organizerProfile.id,
        userId: adminId,
        details: JSON.stringify({ organizerEmail: user.email, reason }),
      },
    });

    await this.mailService.sendOrganizerRejected(user.email, user.name, reason);

    this.logger.log(`ÃƒÂ¢Ã‚ÂÃ…â€™ Organizer rejected: ${user.email}`);

    return {
      message: 'Organizer rejected. Notification email sent.',
    };
  }

  async listEvents() {
    return this.prisma.event.findMany({
      include: {
        category: true,
        organizer: {
          include: { user: { select: { name: true, email: true } } },
        },
        _count: { select: { tickets: true, orders: true, ticketTypes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async setEventStatus(id: string, status: string) {
    const event = await this.prisma.event.findUnique({ where: { id }, select: { id: true } });
    if (!event) throw new NotFoundException('Event not found');
    return this.prisma.event.update({ where: { id }, data: { status } });
  }

  async deleteEvent(id: string) {
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

  async listOrders() {
    const orders = await this.prisma.order.findMany({
      include: {
        event: { select: { id: true, title: true } },
        items: true,
        _count: { select: { tickets: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(({ customerName, customerEmail, customerPhone, ...order }) => ({
      ...order,
      user: { name: customerName, email: customerEmail },
    }));
  }
}
