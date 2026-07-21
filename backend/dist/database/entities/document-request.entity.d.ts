import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Client } from './client.entity';
import { Document } from './document.entity';
export declare enum RequestStatus {
    PENDING = "pending",
    PARTIALLY_UPLOADED = "partially_uploaded",
    COMPLETED = "completed",
    APPROVED = "approved",
    REQUIRES_CORRECTION = "requires_correction"
}
export declare class DocumentRequest extends AppBaseEntity {
    title: string;
    description?: string;
    status: RequestStatus;
    dueDate?: Date;
    priority: number;
    isRequired: boolean;
    tenantId: string;
    clientId: string;
    tenant: Tenant;
    client: Client;
    documents: Document[];
}
