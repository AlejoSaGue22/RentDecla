import { Entity, Column, OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { User } from './user.entity';
import { Client } from './client.entity';
import { DocumentRequest } from './document-request.entity';
import { Workflow } from './workflow.entity';
import { Notification } from './notification.entity';
import { Subscription } from './subscription.entity';

@Entity('tenants')
export class Tenant extends AppBaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ unique: true, length: 100 })
  slug: string;

  @Column({ nullable: true, length: 500 })
  logoUrl?: string;

  @Column({ nullable: true, length: 100 })
  primaryColor?: string;

  @Column({ nullable: true, length: 20 })
  documentPrefix?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings?: Record<string, any>;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Client, (client) => client.tenant)
  clients: Client[];

  @OneToMany(() => DocumentRequest, (dr) => dr.tenant)
  documentRequests: DocumentRequest[];

  @OneToMany(() => Workflow, (w) => w.tenant)
  workflows: Workflow[];

  @OneToMany(() => Notification, (n) => n.tenant)
  notifications: Notification[];

  @OneToMany(() => Subscription, (s) => s.tenant)
  subscriptions: Subscription[];
}
