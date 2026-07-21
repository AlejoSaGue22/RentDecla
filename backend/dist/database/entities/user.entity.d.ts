import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Client } from './client.entity';
import { DocumentReview } from './document-review.entity';
import { UserRole } from '../../common/decorators/roles.decorator';
export declare class User extends AppBaseEntity {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
    tenantId?: string;
    tenant?: Tenant;
    assignedClients: Client[];
    documentReviews: DocumentReview[];
}
