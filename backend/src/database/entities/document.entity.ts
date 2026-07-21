import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { DocumentRequest } from './document-request.entity';
import { Client } from './client.entity';
import { DocumentReview } from './document-review.entity';

export enum DocumentStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_CORRECTION = 'requires_correction',
}

@Entity('documents')
export class Document extends AppBaseEntity {
  @Column({ length: 200 })
  originalName: string;

  @Column({ length: 500 })
  filePath: string;

  @Column({ length: 500, nullable: true })
  fileUrl?: string;

  @Column({ length: 50 })
  mimeType: string;

  @Column({ type: 'integer' })
  fileSize: number;

  @Column({ length: 100, nullable: true })
  category?: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.UPLOADED,
  })
  status: DocumentStatus;

  @Column({ nullable: true, length: 500 })
  rejectionReason?: string;

  @Column()
  clientId: string;

  @Column({ nullable: true })
  documentRequestId?: string;

  @ManyToOne(() => Client, (client) => client.documents)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => DocumentRequest, (dr) => dr.documents, { nullable: true })
  @JoinColumn({ name: 'documentRequestId' })
  documentRequest?: DocumentRequest;

  @OneToMany(() => DocumentReview, (dr) => dr.document)
  reviews: DocumentReview[];
}
