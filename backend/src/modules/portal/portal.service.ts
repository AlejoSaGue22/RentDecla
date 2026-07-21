import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { Client } from '../../database/entities/client.entity';
import { TaxProfile } from '../../database/entities/tax-profile.entity';
import { Document, DocumentStatus } from '../../database/entities/document.entity';
import { DocumentRequest, RequestStatus } from '../../database/entities/document-request.entity';
import { Workflow } from '../../database/entities/workflow.entity';
import { Notification } from '../../database/entities/notification.entity';
import { UpdatePortalProfileDto } from './dto/update-profile.dto';
import { UserRole } from '../../common/decorators/roles.decorator';

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

    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      documentNumber: client.documentNumber,
      status: client.status,
      taxProfile: client.taxProfile,
      workflows,
      summary: {
        totalWorkflows: workflows.length,
        pendingDocumentRequests: pendingRequests,
        rejectedDocuments: pendingDocs,
      },
    };
  }

  async getDocuments(user: { email: string; tenantId?: string; role: string }) {
    const client = await this.resolveClient(user);

    return this.documentRepository.find({
      where: { clientId: client.id },
      order: { createdAt: 'DESC' as const },
    });
  }

  async uploadDocument(
    file: Express.Multer.File,
    user: { email: string; tenantId?: string; role: string },
    category?: string,
    documentRequestId?: string,
  ) {
    if (!file) throw new BadRequestException('File is required');

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

    return this.documentRepository.save(document);
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
}
