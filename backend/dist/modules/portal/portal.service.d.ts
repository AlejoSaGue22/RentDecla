import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Client, ClientStatus } from '../../database/entities/client.entity';
import { TaxProfile } from '../../database/entities/tax-profile.entity';
import { Document } from '../../database/entities/document.entity';
import { DocumentRequest } from '../../database/entities/document-request.entity';
import { Workflow } from '../../database/entities/workflow.entity';
import { Notification } from '../../database/entities/notification.entity';
import { User } from '../../database/entities/user.entity';
import { UpdatePortalProfileDto } from './dto/update-profile.dto';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { NotificationService } from '../notifications/notification.service';
export declare class PortalService {
    private readonly clientRepository;
    private readonly taxProfileRepository;
    private readonly documentRepository;
    private readonly documentRequestRepository;
    private readonly workflowRepository;
    private readonly notificationRepository;
    private readonly userRepository;
    private readonly notificationService;
    constructor(clientRepository: Repository<Client>, taxProfileRepository: Repository<TaxProfile>, documentRepository: Repository<Document>, documentRequestRepository: Repository<DocumentRequest>, workflowRepository: Repository<Workflow>, notificationRepository: Repository<Notification>, userRepository: Repository<User>, notificationService: NotificationService);
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
        phone: string | undefined;
        address: string | undefined;
        city: string | undefined;
        documentNumber: string;
        status: ClientStatus;
        taxProfile: TaxProfile | undefined;
        workflows: Workflow[];
        summary: {
            totalWorkflows: number;
            pendingDocumentRequests: number;
            rejectedDocuments: number;
        };
        recentDocuments: Document[];
        upcomingDeadlines: DocumentRequest[];
        recentNotifications: Notification[];
    }>;
    getDocuments(user: {
        email: string;
        tenantId?: string;
        role: string;
    }): Promise<Document[]>;
    getDocumentStream(id: string, user: {
        email: string;
        tenantId?: string;
        role: string;
    }): Promise<{
        stream: fs.ReadStream;
        mimeType: string;
        originalName: string;
    }>;
    uploadDocument(file: Express.Multer.File, user: {
        email: string;
        tenantId?: string;
        role: string;
    }, category?: string, documentRequestId?: string): Promise<Document>;
    private updateDocumentRequestStatus;
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
    markAllNotificationsRead(user: {
        email: string;
        tenantId?: string;
        role: string;
    }): Promise<{
        marked: number;
    }>;
    updateProfile(user: {
        email: string;
        tenantId?: string;
        role: string;
    }, dto: UpdatePortalProfileDto): Promise<TaxProfile>;
    updatePersonalInfo(user: {
        email: string;
        tenantId?: string;
        role: string;
    }, dto: UpdatePersonalInfoDto): Promise<Client>;
    changePassword(user: {
        email: string;
        tenantId?: string;
        role: string;
    }, dto: ChangePasswordDto): Promise<User>;
}
