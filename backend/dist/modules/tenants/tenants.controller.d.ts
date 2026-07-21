import { TenantsService } from './tenants.service';
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(dto: CreateTenantDto): Promise<import("../../database/entities").Tenant>;
    findAll(): Promise<import("../../database/entities").Tenant[]>;
    findOne(id: string): Promise<import("../../database/entities").Tenant>;
    findBySlug(slug: string): Promise<import("../../database/entities").Tenant>;
    update(id: string, dto: UpdateTenantDto): Promise<import("../../database/entities").Tenant>;
    remove(id: string): Promise<import("../../database/entities").Tenant>;
}
