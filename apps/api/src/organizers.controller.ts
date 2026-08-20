import { Controller, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('admin/organizers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class OrganizersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  index() {
    return this.prisma.organizerProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true, phone: true, status: true } } },
    });
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.prisma.organizerProfile.update({
      where: { id },
      data: { status: 'APPROVED', approvedAt: new Date() },
    });
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.prisma.organizerProfile.update({ where: { id }, data: { status: 'REJECTED' } });
  }
}
