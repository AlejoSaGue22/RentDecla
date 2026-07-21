import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Document } from './document.entity';
import { User } from './user.entity';

export enum ReviewDecision {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_CORRECTION = 'requires_correction',
}

@Entity('document_reviews')
export class DocumentReview extends AppBaseEntity {
  @Column({
    type: 'enum',
    enum: ReviewDecision,
  })
  decision: ReviewDecision;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column()
  documentId: string;

  @Column()
  reviewedById: string;

  @ManyToOne(() => Document, (doc) => doc.reviews)
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @ManyToOne(() => User, (user) => user.documentReviews)
  @JoinColumn({ name: 'reviewedById' })
  reviewedBy: User;
}
