import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Client } from './client.entity';
import { User } from './user.entity';

export enum NotificationType {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  IN_APP = 'in_app',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  READ = 'read',
}

@Entity('notifications')
export class Notification extends AppBaseEntity {
  @Column({ length: 200 })
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.EMAIL,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  readAt?: Date;

  @Column({ nullable: true })
  tenantId?: string;

  @Column({ nullable: true })
  clientId?: string;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.notifications, { nullable: true })
  @JoinColumn({ name: 'tenantId' })
  tenant?: Tenant;

  @ManyToOne(() => Client, (client) => client.notifications, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client?: Client;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;
}
