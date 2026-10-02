import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesController } from './categories.controller';
import { PaymentsController } from './payments.controller';
import { OrdersController } from './orders.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MailModule,
    AuthModule,
    EventsModule,
    AdminModule,
  ],
  controllers: [CategoriesController, PaymentsController, OrdersController, HealthController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
