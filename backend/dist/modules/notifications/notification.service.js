"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../../database/entities/notification.entity");
const mailer_service_1 = require("../mailer/mailer.service");
const client_entity_1 = require("../../database/entities/client.entity");
const user_entity_1 = require("../../database/entities/user.entity");
let NotificationService = NotificationService_1 = class NotificationService {
    notificationRepository;
    clientRepository;
    userRepository;
    mailerService;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(notificationRepository, clientRepository, userRepository, mailerService) {
        this.notificationRepository = notificationRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.mailerService = mailerService;
    }
    async notifyDocumentUploaded(document, client) {
        const contador = await this.userRepository.findOne({
            where: { id: client.assignedToId },
        });
        if (!contador) {
            this.logger.warn(`No contador assigned to client ${client.id}`);
            return;
        }
        const notification = this.notificationRepository.create({
            type: notification_entity_1.NotificationType.EMAIL,
            subject: `Nuevo documento subido: ${document.originalName}`,
            content: `El cliente ${client.firstName} ${client.lastName} ha subido un nuevo documento: ${document.originalName}`,
            status: notification_entity_1.NotificationStatus.PENDING,
            tenantId: client.tenantId,
            userId: contador.id,
        });
        await this.notificationRepository.save(notification);
        const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/documents/${document.id}`;
        const sent = await this.mailerService.sendTemplateEmail(contador.email, `Nuevo documento subido: ${document.originalName}`, 'document-uploaded', {
            clientName: `${client.firstName} ${client.lastName}`,
            documentName: document.originalName,
            category: document.category || 'Sin categoría',
            uploadDate: new Date().toLocaleDateString('es-CO'),
            reviewUrl: portalUrl,
        });
        notification.status = sent ? notification_entity_1.NotificationStatus.SENT : notification_entity_1.NotificationStatus.FAILED;
        notification.sentAt = sent ? new Date() : undefined;
        await this.notificationRepository.save(notification);
        this.logger.log(`Notified contador ${contador.email} about document upload`);
    }
    async notifyDocumentReviewed(document, client, decision, comment) {
        const notification = this.notificationRepository.create({
            type: notification_entity_1.NotificationType.EMAIL,
            subject: `Tu documento ha sido revisado: ${document.originalName}`,
            content: `Tu documento ${document.originalName} ha sido ${decision}. ${comment || ''}`,
            status: notification_entity_1.NotificationStatus.PENDING,
            tenantId: client.tenantId,
            clientId: client.id,
        });
        await this.notificationRepository.save(notification);
        const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/portal/documents`;
        const decisionLabels = {
            approved: 'Aprobado',
            rejected: 'Rechazado',
            requires_correction: 'Requiere corrección',
        };
        const decisionClasses = {
            approved: 'approved',
            rejected: 'rejected',
            requires_correction: 'requires-correction',
        };
        const sent = await this.mailerService.sendTemplateEmail(client.email, `Tu documento ha sido revisado: ${document.originalName}`, 'document-reviewed', {
            clientName: `${client.firstName} ${client.lastName}`,
            documentName: document.originalName,
            decisionLabel: decisionLabels[decision] || decision,
            decisionClass: decisionClasses[decision] || '',
            comment: comment || '',
            portalUrl,
        });
        notification.status = sent ? notification_entity_1.NotificationStatus.SENT : notification_entity_1.NotificationStatus.FAILED;
        notification.sentAt = sent ? new Date() : undefined;
        await this.notificationRepository.save(notification);
        this.logger.log(`Notified client ${client.email} about document review`);
    }
    async notifyWorkflowCompleted(client, taxYear) {
        const notification = this.notificationRepository.create({
            type: notification_entity_1.NotificationType.EMAIL,
            subject: `¡Tu declaración de ${taxYear} ha sido completada!`,
            content: `Tu declaración de renta del año ${taxYear} ha sido completada exitosamente.`,
            status: notification_entity_1.NotificationStatus.PENDING,
            tenantId: client.tenantId,
            clientId: client.id,
        });
        await this.notificationRepository.save(notification);
        const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/portal`;
        const sent = await this.mailerService.sendTemplateEmail(client.email, `¡Tu declaración de ${taxYear} ha sido completada!`, 'workflow-completed', {
            clientName: `${client.firstName} ${client.lastName}`,
            taxYear: taxYear.toString(),
            portalUrl,
        });
        notification.status = sent ? notification_entity_1.NotificationStatus.SENT : notification_entity_1.NotificationStatus.FAILED;
        notification.sentAt = sent ? new Date() : undefined;
        await this.notificationRepository.save(notification);
        this.logger.log(`Notified client ${client.email} about workflow completion`);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mailer_service_1.MailerService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map