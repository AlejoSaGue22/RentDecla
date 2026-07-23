import { Entity, Column } from 'typeorm';
import { AppBaseEntity } from './base.entity';

@Entity('document_categories')
export class DocumentCategory extends AppBaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  tenantId?: string;
}
