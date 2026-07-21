import { WorkflowType, WorkflowStatus } from '../../../database/entities/workflow.entity';
export declare class CreateWorkflowDto {
    type?: WorkflowType;
    taxYear: number;
    dueDate?: Date;
    notes?: string;
    clientId: string;
}
export declare class UpdateWorkflowDto {
    type?: WorkflowType;
    taxYear?: number;
    dueDate?: Date;
    notes?: string;
}
export declare class WorkflowQueryDto {
    status?: WorkflowStatus;
    clientId?: string;
    taxYear?: number;
}
