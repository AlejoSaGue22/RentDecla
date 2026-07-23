import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import * as fs from 'fs';
import { Client, ClientStatus } from '../../database/entities/client.entity';
import { TaxProfile } from '../../database/entities/tax-profile.entity';
import { Document, DocumentStatus } from '../../database/entities/document.entity';
import { DocumentRequest, RequestStatus } from '../../database/entities/document-request.entity';
import { Workflow } from '../../database/entities/workflow.entity';
import { Notification } from '../../database/entities/notification.entity';
import { User } from '../../database/entities/user.entity';
import { UpdatePortalProfileDto } from './dto/update-profile.dto';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserRole } from '../../common/decorators/roles.decorator';
import { NotificationService } from '../notifications/notification.service';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Injectable()
export class PortalService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(TaxProfile)
    private readonly taxProfileRepository: Repository<TaxProfile>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentRequest)
    private readonly documentRequestRepository: Repository<DocumentRequest>,
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  private async resolveClient(user: { email: string; tenantId?: string; role: string }): Promise<Client> {
    if (user.role !== UserRole.CLIENT) {
      throw new UnauthorizedException('Only clients can access the portal');
    }

    const client = await this.clientRepository.findOne({
      where: { email: user.email, tenantId: user.tenantId },
      relations: { taxProfile: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    return client;
  }

  async getProfile(user: { email: string; tenantId?: string; role: string }) {
    const client = await this.resolveClient(user);

    const workflows = await this.workflowRepository.find({
      where: { clientId: client.id },
      order: { taxYear: 'DESC' as const },
      take: 3,
    });

    const pendingRequests = await this.documentRequestRepository.count({
      where: { clientId: client.id, status: RequestStatus.PENDING },
    });

    const pendingDocs = await this.documentRepository.count({
      where: { clientId: client.id, status: DocumentStatus.REJECTED },
    });

    const recentDocuments = await this.documentRepository.find({
      where: { clientId: client.id },
      order: { createdAt: 'DESC' as const },
      take: 5,
    });

    const upcomingDeadlines = await this.documentRequestRepository.find({
      where: { clientId: client.id, dueDate: { $gte: new Date() } as any },
      order: { dueDate: 'ASC' as const },
      take: 5,
    });

    const recentNotifications = await this.notificationRepository.find({
      where: { clientId: client.id, readAt: null as any },
      order: { createdAt: 'DESC' as const },
      take: 3,
    });

    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      documentNumber: client.documentNumber,
      status: client.status,
      taxProfile: client.taxProfile,
      workflows,
      summary: {
        totalWorkflows: workflows.length,
        pendingDocumentRequests: pendingRequests,
        rejectedDocuments: pendingDocs,
      },
      recentDocuments,
      upcomingDeadlines,
      recentNotifications,
    };
  }

  async getDocuments(user: { email: string; tenantId?: string; role: string }) {
    const client = await this.resolveClient(user);

    return this.documentRepository.find({
      where: { clientId: client.id },
      order: { createdAt: 'DESC' as const },
    });
  }

  async getDocumentStream(id: string, user: { email: string; tenantId?: string; role: string }) {
    const client = await this.resolveClient(user);

    const document = await this.documentRepository.findOne({
      where: { id, clientId: client.id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (!fs.existsSync(document.filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    const stream = fs.createReadStream(document.filePath);
    return { stream, mimeType: document.mimeType, originalName: document.originalName };
  }

  async uploadDocument(
    file: Express.Multer.File,
    user: { email: string; tenantId?: string; role: string },
    category?: string,
    documentRequestId?: string,
  ) {
    if (!file) throw new BadRequestException('File is required');

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed. Only PDF, JPG, and PNG are accepted.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds the 10MB limit.');
    }

    const client = await this.resolveClient(user);

    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const clientDir = path.join(uploadDir, client.id);
    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(clientDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const document = this.documentRepository.create({
      originalName: file.originalname,
      filePath,
      fileUrl: `/uploads/${client.id}/${fileName}`,
      mimeType: file.mimetype,
      fileSize: file.size,
      clientId: client.id,
      category,
      documentRequestId,
    });

    const savedDocument = await this.documentRepository.save(document);

    await this.notificationService.notifyDocumentUploaded(savedDocument, client);

    if (documentRequestId) {
      await this.updateDocumentRequestStatus(documentRequestId);
    }

    if (client.status === ClientStatus.PENDING_PROFILE) {
      client.status = ClientStatus.PENDING_DOCUMENTS;
      await this.clientRepository.save(client);
    }

    return savedDocument;
  }

  private async updateDocumentRequestStatus(documentRequestId: string) {
    const request = await this.documentRequestRepository.findOne({
      where: { id: documentRequestId },
      relations: { documents: true },
    });

    if (!request) return;

    const docCount = request.documents?.length || 0;

    if (docCount > 0 && request.status === RequestStatus.PENDING) {
      request.status = RequestStatus.PARTIALLY_UPLOADED;
      await this.documentRequestRepository.save(request);
    }
  }

  async getDocumentRequests(user: { email: string; tenantId?: string; role: string }) {
    const client = await this.resolveClient(user);

    return this.documentRequestRepository.find({
      where: { clientId: client.id },
      relations: { documents: true },
      order: { priority: 'DESC' as const, createdAt: 'DESC' as const },
    });
  }

  async getWorkflows(user: { email: string; tenantId?: string; role: string }) {
    const client = await this.resolveClient(user);

    return this.workflowRepository.find({
      where: { clientId: client.id },
      order: { taxYear: 'DESC' as const },
    });
  }

  async getNotifications(user: { email: string; tenantId?: string; role: string }) {
    const client = await this.resolveClient(user);

    return this.notificationRepository.find({
      where: { clientId: client.id },
      order: { createdAt: 'DESC' as const },
      take: 50,
    });
  }

  async markNotificationRead(id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) throw new NotFoundException('Notification not found');

    notification.status = 'read' as any;
    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }

  async markAllNotificationsRead(user: { email: string; tenantId?: string; role: string }) {
    const client = await this.resolveClient(user);

    const unread = await this.notificationRepository.find({
      where: { clientId: client.id, readAt: null as any },
    });

    for (const n of unread) {
      n.status = 'read' as any;
      n.readAt = new Date();
    }

    await this.notificationRepository.save(unread);
    return { marked: unread.length };
  }

  async updateProfile(
    user: { email: string; tenantId?: string; role: string },
    dto: UpdatePortalProfileDto,
  ) {
    const client = await this.resolveClient(user);

    let profile = await this.taxProfileRepository.findOne({
      where: { clientId: client.id },
    });

    if (profile) {
      Object.assign(profile, dto);
    } else {
      profile = this.taxProfileRepository.create({
        ...dto,
        clientId: client.id,
      });
    }

    return this.taxProfileRepository.save(profile);
  }

  async updatePersonalInfo(
    user: { email: string; tenantId?: string; role: string },
    dto: UpdatePersonalInfoDto,
  ) {
    const client = await this.resolveClient(user);

    Object.assign(client, dto);
    return this.clientRepository.save(client);
  }

  async changePassword(
    user: { email: string; tenantId?: string; role: string },
    dto: ChangePasswordDto,
  ) {
    const client = await this.resolveClient(user);

    const appUser = await this.userRepository.findOne({
      where: { email: client.email },
    });

    if (!appUser) {
      throw new NotFoundException('User account not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, appUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    appUser.password = await bcrypt.hash(dto.newPassword, 10);
    return this.userRepository.save(appUser);
  }
}
