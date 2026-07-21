import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(dto: CreateNotificationDto, tenantId: string): Promise<import("../../database/entities").Notification>;
    findAll(tenantId: string, clientId?: string): Promise<import("../../database/entities").Notification[]>;
    findOne(id: string): Promise<import("../../database/entities").Notification>;
    markAsRead(id: string): Promise<import("../../database/entities").Notification>;
}
