import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany, RelationId } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Client } from './client.entity';
import { Document } from './document.entity';

@Entity('tax_profiles')
export class TaxProfile extends AppBaseEntity {
  @Column({ length: 20, nullable: true })
  rut?: string;

  @Column({ nullable: true })
  hasIngresosLaborales: boolean;

  @Column({ nullable: true })
  hasIngresosIndependientes: boolean;

  @Column({ nullable: true })
  hasRendimientosFinancieros: boolean;

  @Column({ nullable: true })
  hasPropiedades: boolean;

  @Column({ nullable: true })
  hasVehiculos: boolean;

  @Column({ nullable: true })
  hasInversiones: boolean;

  @Column({ nullable: true })
  hasDependientes: boolean;

  @Column({ nullable: true })
  hasMedicinaPrepaga: boolean;

  @Column({ nullable: true })
  hasAportesVoluntarios: boolean;

  @Column({ nullable: true })
  hasCreditoHipotecario: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  ingresosAnuales?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  patrimonioBruto?: number;

  @Column({ type: 'jsonb', nullable: true })
  propiedades?: Record<string, any>[];

  @Column({ type: 'jsonb', nullable: true })
  inversiones?: Record<string, any>[];

  @Column({ type: 'jsonb', nullable: true })
  dependientes?: Record<string, any>[];

  @Column({ type: 'integer', nullable: true })
  taxYear?: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  clientId: string;

  @OneToOne(() => Client, (client) => client.taxProfile)
  @JoinColumn({ name: 'clientId' })
  client: Client;
}
