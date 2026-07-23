import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { TaxProfile } from './tax-profile.entity';
import { Document } from './document.entity';
import { DocumentRequest } from './document-request.entity';
import { Workflow } from './workflow.entity';
import { Notification } from './notification.entity';

export enum ClientStatus {
  PENDING_INVITATION = 'pending_invitation',
  PENDING_PROFILE = 'pending_profile',
  PENDING_DOCUMENTS = 'pending_documents',
  IN_REVIEW = 'in_review',
  REQUIRES_CORRECTION = 'requires_correction',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

@Entity('clients')
export class Client extends AppBaseEntity {
  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 20, unique: true })
  documentNumber: string;

  @Column({ length: 20, nullable: true })
  documentType?: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ length: 255, nullable: true })
  address?: string;

  @Column({ length: 100, nullable: true })
  city?: string;

  @Column({ length: 50, nullable: true })
  nationality?: string;

  @Column({
    type: 'enum',
    enum: ClientStatus,
    default: ClientStatus.PENDING_INVITATION,
  })
  status: ClientStatus;

  @Column({ type: 'date', nullable: true })
  invitationSentAt?: Date;

  @Column({ type: 'date', nullable: true })
  invitationAcceptedAt?: Date;

  @Column({ length: 255, nullable: true })
  invitationToken?: string;

  @Column({ nullable: true, length: 255 })
  notes?: string;

  @Column()
  tenantId: string;

  @Column({ nullable: true })
  assignedToId?: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.clients)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => User, (user) => user.assignedClients, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @OneToOne(() => TaxProfile, (tp) => tp.client, { cascade: true })
  taxProfile?: TaxProfile;

  @OneToMany(() => Document, (doc) => doc.client)
  documents: Document[];

  @OneToMany(() => DocumentRequest, (dr) => dr.client)
  documentRequests: DocumentRequest[];

  @OneToMany(() => Workflow, (w) => w.client)
  workflows: Workflow[];

  @OneToMany(() => Notification, (n) => n.client)
  notifications: Notification[];
}
