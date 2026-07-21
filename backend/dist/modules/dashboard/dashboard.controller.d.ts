import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
        status: import("../../database/entities/client.entity").ClientStatus;
    }[]>;
}
