import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, UpdateWorkflowDto, WorkflowQueryDto } from './dto/workflow.dto';
export declare class WorkflowsController {
    private readonly workflowsService;
    constructor(workflowsService: WorkflowsService);
    create(dto: CreateWorkflowDto, tenantId: string): Promise<import("../../database/entities").Workflow>;
    findAll(query: WorkflowQueryDto, tenantId: string): Promise<import("../../database/entities").Workflow[]>;
    findByClient(clientId: string): Promise<import("../../database/entities").Workflow[]>;
    findOne(id: string): Promise<import("../../database/entities").Workflow>;
    updateStatus(id: string, status: string): Promise<import("../../database/entities").Workflow>;
    update(id: string, dto: UpdateWorkflowDto): Promise<import("../../database/entities").Workflow>;
    remove(id: string): Promise<import("../../database/entities").Workflow>;
}
