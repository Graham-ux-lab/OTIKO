import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EventStatusDto } from '../dto';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  // ---- PUBLIC ----

  @Get()
  findAll(@Query() query: any) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  // ---- ORGANIZER ----

  @Get('organizer/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZER')
  findMyEvents(@CurrentUser() user: any) {
    if (!user.organizerId) {
      throw new ForbiddenException('No organizer profile');
    }
    return this.eventsService.findMyEvents(user.organizerId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZER')
  create(@CurrentUser() user: any, @Body() dto: CreateEventDto) {
    if (!user.organizerId) {
      throw new ForbiddenException('No organizer profile');
    }
    return this.eventsService.create(user.organizerId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZER')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, user.organizerId, dto);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZER')
  publish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.publish(
      id,
      user.organizerId,
      user.organizerStatus,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZER')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.remove(id, user.organizerId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZER')
  setStatus(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: EventStatusDto) {
    return this.eventsService.setStatus(id, user.organizerId, dto.status, user.organizerStatus);
  }
}
