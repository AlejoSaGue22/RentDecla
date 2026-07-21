import { Repository } from 'typeorm';
import { DocumentReview } from '../../database/entities/document-review.entity';
import { Document } from '../../database/entities/document.entity';
import { Client } from '../../database/entities/client.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { NotificationService } from '../notifications/notification.service';
export declare class DocumentReviewsService {
    private readonly reviewRepository;
    private readonly documentRepository;
    private readonly clientRepository;
    private readonly notificationService;
    constructor(reviewRepository: Repository<DocumentReview>, documentRepository: Repository<Document>, clientRepository: Repository<Client>, notificationService: NotificationService);
    create(documentId: string, reviewedById: string, dto: CreateReviewDto): Promise<DocumentReview>;
    findByDocument(documentId: string): Promise<DocumentReview[]>;
    findPendingReviews(): Promise<Document[]>;
    private transitionDocumentStatus;
    private syncClientStatus;
    private notifyClient;
}
