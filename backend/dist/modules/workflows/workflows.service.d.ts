import { Repository } from 'typeorm';
import { Workflow } from '../../database/entities/workflow.entity';
import { CreateWorkflowDto, UpdateWorkflowDto, WorkflowQueryDto } from './dto/workflow.dto';
import { NotificationService } from '../notifications/notification.service';
export declare class WorkflowsService {
    private readonly workflowRepository;
    private readonly notificationService;
    constructor(workflowRepository: Repository<Workflow>, notificationService: NotificationService);
    create(dto: CreateWorkflowDto & {
        tenantId: string;
    }): Promise<Workflow>;
    findAll(tenantId: string, query: WorkflowQueryDto): Promise<Workflow[]>;
    findByClient(clientId: string): Promise<Workflow[]>;
    findOne(id: string): Promise<Workflow>;
    updateStatus(id: string, status: string): Promise<Workflow>;
    update(id: string, dto: UpdateWorkflowDto): Promise<Workflow>;
    remove(id: string): Promise<Workflow>;
}
