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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_review_entity_1 = require("../../database/entities/document-review.entity");
const document_entity_1 = require("../../database/entities/document.entity");
const client_entity_1 = require("../../database/entities/client.entity");
const notification_service_1 = require("../notifications/notification.service");
let DocumentReviewsService = class DocumentReviewsService {
    reviewRepository;
    documentRepository;
    clientRepository;
    notificationService;
    constructor(reviewRepository, documentRepository, clientRepository, notificationService) {
        this.reviewRepository = reviewRepository;
        this.documentRepository = documentRepository;
        this.clientRepository = clientRepository;
        this.notificationService = notificationService;
    }
    async create(documentId, reviewedById, dto) {
        const document = await this.documentRepository.findOne({
            where: { id: documentId },
            relations: { client: true },
        });
        if (!document)
            throw new common_1.NotFoundException('Document not found');
        const review = this.reviewRepository.create({
            documentId,
            reviewedById,
            decision: dto.decision,
            comment: dto.comment,
        });
        await this.reviewRepository.save(review);
        await this.transitionDocumentStatus(document, dto.decision, dto.comment);
        if (document.client) {
            await this.notifyClient(document, dto.decision, dto.comment);
            await this.syncClientStatus(document.clientId);
        }
        return review;
    }
    async findByDocument(documentId) {
        const document = await this.documentRepository.findOne({
            where: { id: documentId },
        });
        if (!document)
            throw new common_1.NotFoundException('Document not found');
        return this.reviewRepository.find({
            where: { documentId },
            relations: { reviewedBy: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findPendingReviews() {
        return this.documentRepository.find({
            where: [
                { status: document_entity_1.DocumentStatus.UPLOADED },
                { status: document_entity_1.DocumentStatus.IN_REVIEW },
                { status: document_entity_1.DocumentStatus.REQUIRES_CORRECTION },
            ],
            relations: { client: true },
            order: { createdAt: 'ASC' },
        });
    }
    async transitionDocumentStatus(document, decision, comment) {
        switch (decision) {
            case document_review_entity_1.ReviewDecision.APPROVED:
                document.status = document_entity_1.DocumentStatus.APPROVED;
                break;
            case document_review_entity_1.ReviewDecision.REJECTED:
                document.status = document_entity_1.DocumentStatus.REJECTED;
                document.rejectionReason = comment || 'Sin razón especificada';
                break;
            case document_review_entity_1.ReviewDecision.REQUIRES_CORRECTION:
                document.status = document_entity_1.DocumentStatus.REQUIRES_CORRECTION;
                document.rejectionReason = comment || 'Se requiere corrección';
                break;
        }
        await this.documentRepository.save(document);
    }
    async syncClientStatus(clientId) {
        const documents = await this.documentRepository.find({
            where: { clientId },
        });
        const totalDocs = documents.length;
        if (totalDocs === 0)
            return;
        const approved = documents.filter((d) => d.status === document_entity_1.DocumentStatus.APPROVED).length;
        const rejected = documents.filter((d) => d.status === document_entity_1.DocumentStatus.REJECTED).length;
        const requiresCorrection = documents.filter((d) => d.status === document_entity_1.DocumentStatus.REQUIRES_CORRECTION).length;
        const client = await this.clientRepository.findOne({ where: { id: clientId } });
        if (!client)
            return;
        if (approved === totalDocs) {
            client.status = client_entity_1.ClientStatus.COMPLETED;
        }
        else if (requiresCorrection > 0 || rejected > 0) {
            client.status = client_entity_1.ClientStatus.REQUIRES_CORRECTION;
        }
        else if (approved > 0) {
            client.status = client_entity_1.ClientStatus.IN_REVIEW;
        }
        await this.clientRepository.save(client);
    }
    async notifyClient(document, decision, comment) {
        if (!document.client)
            return;
        await this.notificationService.notifyDocumentReviewed(document, document.client, decision, comment);
    }
};
exports.DocumentReviewsService = DocumentReviewsService;
exports.DocumentReviewsService = DocumentReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_review_entity_1.DocumentReview)),
    __param(1, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __param(2, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_service_1.NotificationService])
], DocumentReviewsService);
//# sourceMappingURL=document-reviews.service.js.map