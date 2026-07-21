import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { Notification } from '../../database/entities/notification.entity';
import { Client } from '../../database/entities/client.entity';
import { User } from '../../database/entities/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification, Client, User])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
