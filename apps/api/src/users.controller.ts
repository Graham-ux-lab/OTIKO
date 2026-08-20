import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { StatusDto } from './dto';

const userSelect = { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true } as const;

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  index() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: userSelect });
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() dto: StatusDto) {
    return this.prisma.user.update({ where: { id }, data: { status: dto.status }, select: userSelect });
  }
}
