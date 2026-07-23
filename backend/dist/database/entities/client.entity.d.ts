import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { TaxProfile } from './tax-profile.entity';
import { Document } from './document.entity';
import { DocumentRequest } from './document-request.entity';
import { Workflow } from './workflow.entity';
import { Notification } from './notification.entity';
export declare enum ClientStatus {
    PENDING_INVITATION = "pending_invitation",
    PENDING_PROFILE = "pending_profile",
    PENDING_DOCUMENTS = "pending_documents",
    IN_REVIEW = "in_review",
    REQUIRES_CORRECTION = "requires_correction",
    COMPLETED = "completed",
    ARCHIVED = "archived"
}
export declare class Client extends AppBaseEntity {
    firstName: string;
    lastName: string;
    documentNumber: string;
    documentType?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    nationality?: string;
    status: ClientStatus;
    invitationSentAt?: Date;
    invitationAcceptedAt?: Date;
    invitationToken?: string;
    notes?: string;
    tenantId: string;
    assignedToId?: string;
    tenant: Tenant;
    assignedTo?: User;
    taxProfile?: TaxProfile;
    documents: Document[];
    documentRequests: DocumentRequest[];
    workflows: Workflow[];
    notifications: Notification[];
}
