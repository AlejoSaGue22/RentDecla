import { NotificationType } from '../../../database/entities/notification.entity';
export declare class CreateNotificationDto {
    subject: string;
    content: string;
    type?: NotificationType;
    clientId?: string;
    userId?: string;
}
