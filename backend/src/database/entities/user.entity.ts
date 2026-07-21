import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Client } from './client.entity';
import { DocumentReview } from './document-review.entity';
import { UserRole } from '../../common/decorators/roles.decorator';

@Entity('users')
export class User extends AppBaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONTADOR,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  tenantId?: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { nullable: true })
  @JoinColumn({ name: 'tenantId' })
  tenant?: Tenant;

  @OneToMany(() => Client, (client) => client.assignedTo)
  assignedClients: Client[];

  @OneToMany(() => DocumentReview, (dr) => dr.reviewedBy)
  documentReviews: DocumentReview[];
}
