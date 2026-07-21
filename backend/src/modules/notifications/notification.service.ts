import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from '../../database/entities/notification.entity';
import { MailerService } from '../mailer/mailer.service';
import { Document } from '../../database/entities/document.entity';
import { Client } from '../../database/entities/client.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  async notifyDocumentUploaded(document: Document, client: Client) {
    const contador = await this.userRepository.findOne({
      where: { id: client.assignedToId },
    });

    if (!contador) {
      this.logger.warn(`No contador assigned to client ${client.id}`);
      return;
    }

    const notification = this.notificationRepository.create({
      type: NotificationType.EMAIL,
      subject: `Nuevo documento subido: ${document.originalName}`,
      content: `El cliente ${client.firstName} ${client.lastName} ha subido un nuevo documento: ${document.originalName}`,
      status: NotificationStatus.PENDING,
      tenantId: client.tenantId,
      userId: contador.id,
    });

    await this.notificationRepository.save(notification);

    const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/documents/${document.id}`;
    
    const sent = await this.mailerService.sendTemplateEmail(
      contador.email,
      `Nuevo documento subido: ${document.originalName}`,
      'document-uploaded',
      {
        clientName: `${client.firstName} ${client.lastName}`,
        documentName: document.originalName,
        category: document.category || 'Sin categoría',
        uploadDate: new Date().toLocaleDateString('es-CO'),
        reviewUrl: portalUrl,
      },
    );

    notification.status = sent ? NotificationStatus.SENT : NotificationStatus.FAILED;
    notification.sentAt = sent ? new Date() : undefined;
    await this.notificationRepository.save(notification);

    this.logger.log(`Notified contador ${contador.email} about document upload`);
  }

  async notifyDocumentReviewed(document: Document, client: Client, decision: string, comment?: string) {
    const notification = this.notificationRepository.create({
      type: NotificationType.EMAIL,
      subject: `Tu documento ha sido revisado: ${document.originalName}`,
      content: `Tu documento ${document.originalName} ha sido ${decision}. ${comment || ''}`,
      status: NotificationStatus.PENDING,
      tenantId: client.tenantId,
      clientId: client.id,
    });

    await this.notificationRepository.save(notification);

    const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/portal/documents`;
    
    const decisionLabels: Record<string, string> = {
      approved: 'Aprobado',
      rejected: 'Rechazado',
      requires_correction: 'Requiere corrección',
    };

    const decisionClasses: Record<string, string> = {
      approved: 'approved',
      rejected: 'rejected',
      requires_correction: 'requires-correction',
    };

    const sent = await this.mailerService.sendTemplateEmail(
      client.email,
      `Tu documento ha sido revisado: ${document.originalName}`,
      'document-reviewed',
      {
        clientName: `${client.firstName} ${client.lastName}`,
        documentName: document.originalName,
        decisionLabel: decisionLabels[decision] || decision,
        decisionClass: decisionClasses[decision] || '',
        comment: comment || '',
        portalUrl,
      },
    );

    notification.status = sent ? NotificationStatus.SENT : NotificationStatus.FAILED;
    notification.sentAt = sent ? new Date() : undefined;
    await this.notificationRepository.save(notification);

    this.logger.log(`Notified client ${client.email} about document review`);
  }

  async notifyWorkflowCompleted(client: Client, taxYear: number) {
    const notification = this.notificationRepository.create({
      type: NotificationType.EMAIL,
      subject: `¡Tu declaración de ${taxYear} ha sido completada!`,
      content: `Tu declaración de renta del año ${taxYear} ha sido completada exitosamente.`,
      status: NotificationStatus.PENDING,
      tenantId: client.tenantId,
      clientId: client.id,
    });

    await this.notificationRepository.save(notification);

    const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/portal`;
    
    const sent = await this.mailerService.sendTemplateEmail(
      client.email,
      `¡Tu declaración de ${taxYear} ha sido completada!`,
      'workflow-completed',
      {
        clientName: `${client.firstName} ${client.lastName}`,
        taxYear: taxYear.toString(),
        portalUrl,
      },
    );

    notification.status = sent ? NotificationStatus.SENT : NotificationStatus.FAILED;
    notification.sentAt = sent ? new Date() : undefined;
    await this.notificationRepository.save(notification);

    this.logger.log(`Notified client ${client.email} about workflow completion`);
  }
}
