import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Client } from './client.entity';

export enum WorkflowStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  AWAITING_DOCUMENTS = 'awaiting_documents',
  IN_REVIEW = 'in_review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum WorkflowType {
  DECLARACION_RENTA = 'declaracion_renta',
  DECLARACION_SIMPLIFICADA = 'declaracion_simplificada',
  CORRECCION = 'correccion',
  RECONSIDERACION = 'reconsideracion',
}

@Entity('workflows')
export class Workflow extends AppBaseEntity {
  @Column({
    type: 'enum',
    enum: WorkflowType,
    default: WorkflowType.DECLARACION_RENTA,
  })
  type: WorkflowType;

  @Column({
    type: 'enum',
    enum: WorkflowStatus,
    default: WorkflowStatus.NOT_STARTED,
  })
  status: WorkflowStatus;

  @Column({ type: 'integer' })
  taxYear: number;

  @Column({ type: 'date', nullable: true })
  startedAt?: Date;

  @Column({ type: 'date', nullable: true })
  completedAt?: Date;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @Column({ type: 'jsonb', nullable: true })
  progress?: Record<string, any>;

  @Column({ nullable: true, length: 500 })
  notes?: string;

  @Column()
  tenantId: string;

  @Column()
  clientId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.workflows)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => Client, (client) => client.workflows)
  @JoinColumn({ name: 'clientId' })
  client: Client;
}
