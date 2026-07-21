import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DocumentReview,
  ReviewDecision,
} from '../../database/entities/document-review.entity';
import { Document, DocumentStatus } from '../../database/entities/document.entity';
import { Client, ClientStatus } from '../../database/entities/client.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class DocumentReviewsService {
  constructor(
    @InjectRepository(DocumentReview)
    private readonly reviewRepository: Repository<DocumentReview>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(documentId: string, reviewedById: string, dto: CreateReviewDto) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: { client: true },
    });

    if (!document) throw new NotFoundException('Document not found');

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

  async findByDocument(documentId: string) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });
    if (!document) throw new NotFoundException('Document not found');

    return this.reviewRepository.find({
      where: { documentId },
      relations: { reviewedBy: true },
      order: { createdAt: 'DESC' as const },
    });
  }

  async findPendingReviews() {
    return this.documentRepository.find({
      where: [
        { status: DocumentStatus.UPLOADED },
        { status: DocumentStatus.IN_REVIEW },
        { status: DocumentStatus.REQUIRES_CORRECTION },
      ],
      relations: { client: true },
      order: { createdAt: 'ASC' as const },
    });
  }

  private async transitionDocumentStatus(
    document: Document,
    decision: ReviewDecision,
    comment?: string,
  ) {
    switch (decision) {
      case ReviewDecision.APPROVED:
        document.status = DocumentStatus.APPROVED;
        break;
      case ReviewDecision.REJECTED:
        document.status = DocumentStatus.REJECTED;
        document.rejectionReason = comment || 'Sin razón especificada';
        break;
      case ReviewDecision.REQUIRES_CORRECTION:
        document.status = DocumentStatus.REQUIRES_CORRECTION;
        document.rejectionReason = comment || 'Se requiere corrección';
        break;
    }

    await this.documentRepository.save(document);
  }

  private async syncClientStatus(clientId: string) {
    const documents = await this.documentRepository.find({
      where: { clientId },
    });

    const totalDocs = documents.length;
    if (totalDocs === 0) return;

    const approved = documents.filter((d) => d.status === DocumentStatus.APPROVED).length;
    const rejected = documents.filter((d) => d.status === DocumentStatus.REJECTED).length;
    const requiresCorrection = documents.filter((d) => d.status === DocumentStatus.REQUIRES_CORRECTION).length;

    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) return;

    if (approved === totalDocs) {
      client.status = ClientStatus.COMPLETED;
    } else if (requiresCorrection > 0 || rejected > 0) {
      client.status = ClientStatus.REQUIRES_CORRECTION;
    } else if (approved > 0) {
      client.status = ClientStatus.IN_REVIEW;
    }

    await this.clientRepository.save(client);
  }

  private async notifyClient(
    document: Document,
    decision: ReviewDecision,
    comment?: string,
  ) {
    if (!document.client) return;

    await this.notificationService.notifyDocumentReviewed(
      document,
      document.client,
      decision,
      comment,
    );
  }
}
