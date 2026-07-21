import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationService } from './notification.service';
import { Notification } from '../../database/entities/notification.entity';
import { Client } from '../../database/entities/client.entity';
import { User } from '../../database/entities/user.entity';
import { MailerModule } from '../mailer/mailer.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Client, User]),
    MailerModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationService],
  exports: [NotificationsService, NotificationService],
})
export class NotificationsModule {}
