import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RejectOrganizerDto } from './dto/reject-organizer.dto';
import { StatusDto, EventStatusDto } from '../dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Patch('users/:id/status')
  setUserStatus(@Param('id') id: string, @Body() dto: StatusDto) {
    return this.adminService.setUserStatus(id, dto.status);
  }

  @Get('organizers')
  listOrganizers(@Query('status') status?: string) {
    return this.adminService.listOrganizers(status);
  }

  @Get('organizers/:id')
  getOrganizer(@Param('id') id: string) {
    return this.adminService.getOrganizer(id);
  }

  @Patch('organizers/:id/approve')
  approveOrganizer(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.approveOrganizer(id, user.id);
  }

  @Patch('organizers/:id/reject')
  rejectOrganizer(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: RejectOrganizerDto,
  ) {
    return this.adminService.rejectOrganizer(id, user.id, dto.reason);
  }

  @Get('events')
  listEvents() {
    return this.adminService.listEvents();
  }

  @Patch('events/:id/status')
  setEventStatus(@Param('id') id: string, @Body() dto: EventStatusDto) {
    return this.adminService.setEventStatus(id, dto.status);
  }

  @Delete('events/:id')
  deleteEvent(@Param('id') id: string) {
    return this.adminService.deleteEvent(id);
  }

  @Get('orders')
  listOrders() {
    return this.adminService.listOrders();
  }
}
