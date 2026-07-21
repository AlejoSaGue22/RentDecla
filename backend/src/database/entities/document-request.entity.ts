import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Client } from './client.entity';
import { Document } from './document.entity';

export enum RequestStatus {
  PENDING = 'pending',
  PARTIALLY_UPLOADED = 'partially_uploaded',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REQUIRES_CORRECTION = 'requires_correction',
}

@Entity('document_requests')
export class DocumentRequest extends AppBaseEntity {
  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @Column({ type: 'integer', default: 0 })
  priority: number;

  @Column({ default: false })
  isRequired: boolean;

  @Column()
  tenantId: string;

  @Column()
  clientId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.documentRequests)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => Client, (client) => client.documentRequests)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @OneToMany(() => Document, (doc) => doc.documentRequest)
  documents: Document[];
}
