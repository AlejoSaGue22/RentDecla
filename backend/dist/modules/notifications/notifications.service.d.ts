import { Repository } from 'typeorm';
import { Notification } from '../../database/entities/notification.entity';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsService {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    create(dto: CreateNotificationDto & {
        tenantId: string;
    }): Promise<Notification>;
    findAll(tenantId: string, clientId?: string): Promise<Notification[]>;
    findOne(id: string): Promise<Notification>;
    markAsRead(id: string): Promise<Notification>;
}
