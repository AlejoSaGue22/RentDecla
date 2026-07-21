import { PortalService } from './portal.service';
import { UpdatePortalProfileDto } from './dto/update-profile.dto';
export declare class PortalController {
    private readonly portalService;
    constructor(portalService: PortalService);
    getProfile(user: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        documentNumber: string;
        status: import("../../database/entities/client.entity").ClientStatus;
        taxProfile: import("../../database/entities").TaxProfile | undefined;
        workflows: import("../../database/entities").Workflow[];
        summary: {
            totalWorkflows: number;
            pendingDocumentRequests: number;
            rejectedDocuments: number;
        };
    }>;
    getDocuments(user: any): Promise<import("../../database/entities").Document[]>;
    uploadDocument(file: Express.Multer.File, user: any, category?: string, documentRequestId?: string): Promise<import("../../database/entities").Document>;
    getDocumentRequests(user: any): Promise<import("../../database/entities").DocumentRequest[]>;
    getWorkflows(user: any): Promise<import("../../database/entities").Workflow[]>;
    getNotifications(user: any): Promise<import("../../database/entities").Notification[]>;
    markNotificationRead(id: string): Promise<import("../../database/entities").Notification>;
    updateProfile(user: any, dto: UpdatePortalProfileDto): Promise<import("../../database/entities").TaxProfile>;
}
