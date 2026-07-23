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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs = __importStar(require("fs"));
const document_entity_1 = require("../../database/entities/document.entity");
const client_entity_1 = require("../../database/entities/client.entity");
const notification_service_1 = require("../notifications/notification.service");
const storage_path_util_1 = require("../../common/utils/storage-path.util");
let DocumentsService = class DocumentsService {
    documentRepository;
    clientRepository;
    notificationService;
    constructor(documentRepository, clientRepository, notificationService) {
        this.documentRepository = documentRepository;
        this.clientRepository = clientRepository;
        this.notificationService = notificationService;
    }
    async upload(file, metadata) {
        if (!file)
            throw new common_1.BadRequestException('File is required');
        const client = await this.clientRepository.findOne({
            where: { id: metadata.clientId },
            relations: { tenant: true },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        const fileName = `${Date.now()}-${file.originalname}`;
        const { filePath, fileUrl } = (0, storage_path_util_1.getStoragePath)(client, fileName);
        fs.writeFileSync(filePath, file.buffer);
        const document = this.documentRepository.create({
            originalName: file.originalname,
            filePath,
            fileUrl,
            mimeType: file.mimetype,
            fileSize: file.size,
            clientId: metadata.clientId,
            category: metadata.category,
            description: metadata.description,
            documentRequestId: metadata.documentRequestId,
        });
        const savedDocument = await this.documentRepository.save(document);
        await this.notificationService.notifyDocumentUploaded(savedDocument, client);
        return savedDocument;
    }
    async findByClient(clientId) {
        return this.documentRepository.find({
            where: { clientId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const doc = await this.documentRepository.findOne({
            where: { id },
            relations: { reviews: { reviewedBy: true } },
        });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        return doc;
    }
    async getFileStream(id) {
        const doc = await this.findOne(id);
        if (!fs.existsSync(doc.filePath)) {
            throw new common_1.NotFoundException('File not found on disk');
        }
        const stream = fs.createReadStream(doc.filePath);
        return { stream, mimeType: doc.mimeType, originalName: doc.originalName };
    }
    async update(id, dto) {
        const doc = await this.findOne(id);
        Object.assign(doc, dto);
        return this.documentRepository.save(doc);
    }
    async remove(id) {
        const doc = await this.findOne(id);
        if (fs.existsSync(doc.filePath)) {
            fs.unlinkSync(doc.filePath);
        }
        return this.documentRepository.softRemove(doc);
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map