import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Client } from './client.entity';
export declare enum WorkflowStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    AWAITING_DOCUMENTS = "awaiting_documents",
    IN_REVIEW = "in_review",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum WorkflowType {
    DECLARACION_RENTA = "declaracion_renta",
    DECLARACION_SIMPLIFICADA = "declaracion_simplificada",
    CORRECCION = "correccion",
    RECONSIDERACION = "reconsideracion"
}
export declare class Workflow extends AppBaseEntity {
    type: WorkflowType;
    status: WorkflowStatus;
    taxYear: number;
    startedAt?: Date;
    completedAt?: Date;
    dueDate?: Date;
    progress?: Record<string, any>;
    notes?: string;
    tenantId: string;
    clientId: string;
    tenant: Tenant;
    client: Client;
}
