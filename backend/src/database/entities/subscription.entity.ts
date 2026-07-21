import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';

export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  TRIAL = 'trial',
}

@Entity('subscriptions')
export class Subscription extends AppBaseEntity {
  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  plan: SubscriptionPlan;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.TRIAL,
  })
  status: SubscriptionStatus;

  @Column({ type: 'integer', default: 0 })
  maxClients: number;

  @Column({ type: 'integer', default: 1 })
  maxUsers: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ nullable: true, length: 100 })
  stripeSubscriptionId?: string;

  @Column({ type: 'date', nullable: true })
  trialEndsAt?: Date;

  @Column({ type: 'date', nullable: true })
  currentPeriodStart?: Date;

  @Column({ type: 'date', nullable: true })
  currentPeriodEnd?: Date;

  @Column({ type: 'jsonb', nullable: true })
  features?: Record<string, boolean>;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.subscriptions)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;
}
