import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../database/entities/notification.entity';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto & { tenantId: string }) {
    const notification = this.notificationRepository.create(dto);
    return this.notificationRepository.save(notification);
  }

  async findAll(tenantId: string, clientId?: string) {
    const where: any = { tenantId };
    if (clientId) where.clientId = clientId;
    return this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async findOne(id: string) {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async markAsRead(id: string) {
    const notification = await this.findOne(id);
    notification.status = 'read' as any;
    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }
}
