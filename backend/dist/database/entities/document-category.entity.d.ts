import { AppBaseEntity } from './base.entity';
export declare class DocumentCategory extends AppBaseEntity {
    name: string;
    description?: string;
    isActive: boolean;
    tenantId?: string;
}
