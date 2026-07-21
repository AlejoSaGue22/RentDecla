import { AppBaseEntity } from './base.entity';
import { User } from './user.entity';
import { Client } from './client.entity';
import { DocumentRequest } from './document-request.entity';
import { Workflow } from './workflow.entity';
import { Notification } from './notification.entity';
import { Subscription } from './subscription.entity';
export declare class Tenant extends AppBaseEntity {
    name: string;
    slug: string;
    logoUrl?: string;
    primaryColor?: string;
    documentPrefix?: string;
    isActive: boolean;
    settings?: Record<string, any>;
    users: User[];
    clients: Client[];
    documentRequests: DocumentRequest[];
    workflows: Workflow[];
    notifications: Notification[];
    subscriptions: Subscription[];
}
