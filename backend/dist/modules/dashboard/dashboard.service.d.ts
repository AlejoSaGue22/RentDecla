import { Repository } from 'typeorm';
import { Client, ClientStatus } from '../../database/entities/client.entity';
import { Workflow } from '../../database/entities/workflow.entity';
import { Document } from '../../database/entities/document.entity';
import { User } from '../../database/entities/user.entity';
export declare class DashboardService {
    private readonly clientRepository;
    private readonly workflowRepository;
    private readonly documentRepository;
    private readonly userRepository;
    constructor(clientRepository: Repository<Client>, workflowRepository: Repository<Workflow>, documentRepository: Repository<Document>, userRepository: Repository<User>);
    getStats(tenantId: string): Promise<{
        totalClients: number;
        pendingClients: number;
        completedClients: number;
        inReviewClients: number;
        activeWorkflows: number;
        completedWorkflows: number;
        pendingDocuments: number;
        totalUsers: number;
    }>;
    getRecentActivity(tenantId: string): Promise<{
        type: string;
        description: string;
        date: Date;
        status: ClientStatus;
    }[]>;
}
