import type { Response } from 'express';
import { PortalService } from './portal.service';
import { UpdatePortalProfileDto } from './dto/update-profile.dto';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class PortalController {
    private readonly portalService;
    constructor(portalService: PortalService);
    getProfile(user: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | undefined;
        address: string | undefined;
        city: string | undefined;
        documentNumber: string;
        status: import("../../database/entities/client.entity").ClientStatus;
        taxProfile: import("../../database/entities").TaxProfile | undefined;
        workflows: import("../../database/entities").Workflow[];
        summary: {
            totalWorkflows: number;
            pendingDocumentRequests: number;
            rejectedDocuments: number;
        };
        recentDocuments: import("../../database/entities").Document[];
        upcomingDeadlines: import("../../database/entities").DocumentRequest[];
        recentNotifications: import("../../database/entities").Notification[];
    }>;
    updatePersonalInfo(user: any, dto: UpdatePersonalInfoDto): Promise<import("../../database/entities").Client>;
    changePassword(user: any, dto: ChangePasswordDto): Promise<import("../../database/entities").User>;
    getDocuments(user: any): Promise<import("../../database/entities").Document[]>;
    downloadDocument(id: string, user: any, res: Response): Promise<void>;
    uploadDocument(file: Express.Multer.File, user: any, category?: string, documentRequestId?: string): Promise<import("../../database/entities").Document>;
    getDocumentRequests(user: any): Promise<import("../../database/entities").DocumentRequest[]>;
    getWorkflows(user: any): Promise<import("../../database/entities").Workflow[]>;
    getNotifications(user: any): Promise<import("../../database/entities").Notification[]>;
    markNotificationRead(id: string): Promise<import("../../database/entities").Notification>;
    markAllNotificationsRead(user: any): Promise<{
        marked: number;
    }>;
    updateProfile(user: any, dto: UpdatePortalProfileDto): Promise<import("../../database/entities").TaxProfile>;
}
