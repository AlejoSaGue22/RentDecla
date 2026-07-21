import { DocumentReviewsService } from './document-reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class DocumentReviewsController {
    private readonly documentReviewsService;
    constructor(documentReviewsService: DocumentReviewsService);
    review(documentId: string, dto: CreateReviewDto, userId: string): Promise<import("../../database/entities").DocumentReview>;
    findByDocument(documentId: string): Promise<import("../../database/entities").DocumentReview[]>;
}
export declare class ReviewsController {
    private readonly documentReviewsService;
    constructor(documentReviewsService: DocumentReviewsService);
    findPending(): Promise<import("../../database/entities").Document[]>;
}
