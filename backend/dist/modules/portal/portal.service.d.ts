import { Repository } from 'typeorm';
import { Client } from '../../database/entities/client.entity';
import { TaxProfile } from '../../database/entities/tax-profile.entity';
import { Document } from '../../database/entities/document.entity';
import { DocumentRequest } from '../../database/entities/document-request.entity';
import { Workflow } from '../../database/entities/workflow.entity';
import { Notification } from '../../database/entities/notification.entity';
import { UpdatePortalProfileDto } from './dto/update-profile.dto';
export declare class PortalService {
    private readonly clientRepository;
    private readonly taxProfileRepository;
    private readonly documentRepository;
    private readonly documentRequestRepository;
    private readonly workflowRepository;
    private readonly notificationRepository;
    constructor(clientRepository: Repository<Client>, taxProfileRepository: Repository<TaxProfile>, documentRepository: Repository<Document>, documentRequestRepository: Repository<DocumentRequest>, workflowRepository: Repository<Workflow>, notificationRepository: Repository<Notification>);
    private resolveClient;
    getProfile(user: {
        email: string;
        tenantId?: string;
        role: string;
    }): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        documentNumber: string;
        status: import("../../database/entities/client.entity").ClientStatus;
        taxProfile: TaxProfile | undefined;
        workflows: Workflow[];
        summary: {
            totalWorkflows: number;
            pendingDocumentRequests: number;
            rejectedDocuments: number;
        };
    }>;
    getDocuments(user: {
        email: string;
        tenantId?: string;
        role: string;
    }): Promise<Document[]>;
    uploadDocument(file: Express.Multer.File, user: {
        email: string;
        tenantId?: string;
        role: string;
    }, category?: string, documentRequestId?: string): Promise<Document>;
    getDocumentRequests(user: {
        email: string;
        tenantId?: string;
        role: string;
    }): Promise<DocumentRequest[]>;
    getWorkflows(user: {
        email: string;
        tenantId?: string;
        role: string;
    }): Promise<Workflow[]>;
    getNotifications(user: {
        email: string;
        tenantId?: string;
        role: string;
    }): Promise<Notification[]>;
    markNotificationRead(id: string): Promise<Notification>;
    updateProfile(user: {
        email: string;
        tenantId?: string;
        role: string;
    }, dto: UpdatePortalProfileDto): Promise<TaxProfile>;
}
