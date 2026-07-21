import { AppBaseEntity } from './base.entity';
import { DocumentRequest } from './document-request.entity';
import { Client } from './client.entity';
import { DocumentReview } from './document-review.entity';
export declare enum DocumentStatus {
    PENDING = "pending",
    UPLOADED = "uploaded",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    REQUIRES_CORRECTION = "requires_correction"
}
export declare class Document extends AppBaseEntity {
    originalName: string;
    filePath: string;
    fileUrl?: string;
    mimeType: string;
    fileSize: number;
    category?: string;
    description?: string;
    version: number;
    status: DocumentStatus;
    rejectionReason?: string;
    clientId: string;
    documentRequestId?: string;
    client: Client;
    documentRequest?: DocumentRequest;
    reviews: DocumentReview[];
}
