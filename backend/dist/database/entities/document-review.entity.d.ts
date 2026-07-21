import { AppBaseEntity } from './base.entity';
import { Document } from './document.entity';
import { User } from './user.entity';
export declare enum ReviewDecision {
    APPROVED = "approved",
    REJECTED = "rejected",
    REQUIRES_CORRECTION = "requires_correction"
}
export declare class DocumentReview extends AppBaseEntity {
    decision: ReviewDecision;
    comment?: string;
    documentId: string;
    reviewedById: string;
    document: Document;
    reviewedBy: User;
}
