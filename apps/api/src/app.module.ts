import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HealthController } from './health.controller';
import { EventsController } from './events.controller';
import { CategoriesController } from './categories.controller';
import { PrismaService } from './prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { UsersController } from './users.controller';
import { OrganizersController } from './organizers.controller';
import { AdminEventsController } from './admin-events.controller';
import { OrganizerEventsController } from './organizer-events.controller';
import { OrdersController } from './orders.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [
    HealthController,
    EventsController,
    CategoriesController,
    AuthController,
    UsersController,
    OrganizersController,
    AdminEventsController,
    OrganizerEventsController,
    OrdersController,
  ],
  providers: [PrismaService, AuthService, JwtAuthGuard, RolesGuard],
})
export class AppModule {}
