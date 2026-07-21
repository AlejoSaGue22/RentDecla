import { ReviewDecision } from '../../../database/entities/document-review.entity';
export declare class CreateReviewDto {
    decision: ReviewDecision;
    comment?: string;
}
