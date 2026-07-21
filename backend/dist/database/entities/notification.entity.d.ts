import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Client } from './client.entity';
import { User } from './user.entity';
export declare enum NotificationType {
    EMAIL = "email",
    WHATSAPP = "whatsapp",
    IN_APP = "in_app"
}
export declare enum NotificationStatus {
    PENDING = "pending",
    SENT = "sent",
    FAILED = "failed",
    READ = "read"
}
export declare class Notification extends AppBaseEntity {
    subject: string;
    content: string;
    type: NotificationType;
    status: NotificationStatus;
    sentAt?: Date;
    readAt?: Date;
    tenantId?: string;
    clientId?: string;
    userId?: string;
    tenant?: Tenant;
    client?: Client;
    user?: User;
}
