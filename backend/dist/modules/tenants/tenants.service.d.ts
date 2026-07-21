import { Repository } from 'typeorm';
import { Tenant } from '../../database/entities/tenant.entity';
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';
export declare class TenantsService {
    private readonly tenantRepository;
    constructor(tenantRepository: Repository<Tenant>);
    create(dto: CreateTenantDto): Promise<Tenant>;
    findAll(): Promise<Tenant[]>;
    findOne(id: string): Promise<Tenant>;
    findBySlug(slug: string): Promise<Tenant>;
    update(id: string, dto: UpdateTenantDto): Promise<Tenant>;
    remove(id: string): Promise<Tenant>;
}
