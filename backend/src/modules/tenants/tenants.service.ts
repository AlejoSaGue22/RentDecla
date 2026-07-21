import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../database/entities/tenant.entity';
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async create(dto: CreateTenantDto) {
    const existing = await this.tenantRepository.findOne({
      where: { slug: dto.slug },
    });
    if (existing) throw new ConflictException('Slug already exists');

    const tenant = this.tenantRepository.create(dto);
    return this.tenantRepository.save(tenant);
  }

  findAll() {
    return this.tenantRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async findBySlug(slug: string) {
    const tenant = await this.tenantRepository.findOne({ where: { slug } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await this.findOne(id);
    Object.assign(tenant, dto);
    return this.tenantRepository.save(tenant);
  }

  async remove(id: string) {
    const tenant = await this.findOne(id);
    tenant.isActive = false;
    return this.tenantRepository.save(tenant);
  }
}
