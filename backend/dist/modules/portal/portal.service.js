"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const client_entity_1 = require("../../database/entities/client.entity");
const tax_profile_entity_1 = require("../../database/entities/tax-profile.entity");
const document_entity_1 = require("../../database/entities/document.entity");
const document_request_entity_1 = require("../../database/entities/document-request.entity");
const workflow_entity_1 = require("../../database/entities/workflow.entity");
const notification_entity_1 = require("../../database/entities/notification.entity");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let PortalService = class PortalService {
    clientRepository;
    taxProfileRepository;
    documentRepository;
    documentRequestRepository;
    workflowRepository;
    notificationRepository;
    constructor(clientRepository, taxProfileRepository, documentRepository, documentRequestRepository, workflowRepository, notificationRepository) {
        this.clientRepository = clientRepository;
        this.taxProfileRepository = taxProfileRepository;
        this.documentRepository = documentRepository;
        this.documentRequestRepository = documentRequestRepository;
        this.workflowRepository = workflowRepository;
        this.notificationRepository = notificationRepository;
    }
    async resolveClient(user) {
        if (user.role !== roles_decorator_1.UserRole.CLIENT) {
            throw new common_1.UnauthorizedException('Only clients can access the portal');
        }
        const client = await this.clientRepository.findOne({
            where: { email: user.email, tenantId: user.tenantId },
            relations: { taxProfile: true, tenant: true },
        });
        if (!client) {
            throw new common_1.NotFoundException('Client profile not found');
        }
        return client;
    }
    async getProfile(user) {
        const client = await this.resolveClient(user);
        const workflows = await this.workflowRepository.find({
            where: { clientId: client.id },
            order: { taxYear: 'DESC' },
            take: 3,
        });
        const pendingRequests = await this.documentRequestRepository.count({
            where: { clientId: client.id, status: document_request_entity_1.RequestStatus.PENDING },
        });
        const pendingDocs = await this.documentRepository.count({
            where: { clientId: client.id, status: document_entity_1.DocumentStatus.REJECTED },
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
    async getDocuments(user) {
        const client = await this.resolveClient(user);
        return this.documentRepository.find({
            where: { clientId: client.id },
            order: { createdAt: 'DESC' },
        });
    }
    async uploadDocument(file, user, category, documentRequestId) {
        if (!file)
            throw new common_1.BadRequestException('File is required');
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
    async getDocumentRequests(user) {
        const client = await this.resolveClient(user);
        return this.documentRequestRepository.find({
            where: { clientId: client.id },
            relations: { documents: true },
            order: { priority: 'DESC', createdAt: 'DESC' },
        });
    }
    async getWorkflows(user) {
        const client = await this.resolveClient(user);
        return this.workflowRepository.find({
            where: { clientId: client.id },
            order: { taxYear: 'DESC' },
        });
    }
    async getNotifications(user) {
        const client = await this.resolveClient(user);
        return this.notificationRepository.find({
            where: { clientId: client.id },
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async markNotificationRead(id) {
        const notification = await this.notificationRepository.findOne({
            where: { id },
        });
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        notification.status = 'read';
        notification.readAt = new Date();
        return this.notificationRepository.save(notification);
    }
    async updateProfile(user, dto) {
        const client = await this.resolveClient(user);
        let profile = await this.taxProfileRepository.findOne({
            where: { clientId: client.id },
        });
        if (profile) {
            Object.assign(profile, dto);
        }
        else {
            profile = this.taxProfileRepository.create({
                ...dto,
                clientId: client.id,
            });
        }
        return this.taxProfileRepository.save(profile);
    }
};
exports.PortalService = PortalService;
exports.PortalService = PortalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(1, (0, typeorm_1.InjectRepository)(tax_profile_entity_1.TaxProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __param(3, (0, typeorm_1.InjectRepository)(document_request_entity_1.DocumentRequest)),
    __param(4, (0, typeorm_1.InjectRepository)(workflow_entity_1.Workflow)),
    __param(5, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PortalService);
//# sourceMappingURL=portal.service.js.map