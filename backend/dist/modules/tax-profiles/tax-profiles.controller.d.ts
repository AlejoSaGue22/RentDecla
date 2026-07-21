import { TaxProfilesService } from './tax-profiles.service';
import { CreateTaxProfileDto, UpdateTaxProfileDto } from './dto/tax-profile.dto';
export declare class TaxProfilesController {
    private readonly taxProfilesService;
    constructor(taxProfilesService: TaxProfilesService);
    create(dto: CreateTaxProfileDto): Promise<import("../../database/entities").TaxProfile>;
    findByClient(clientId: string): Promise<import("../../database/entities").TaxProfile>;
    update(id: string, dto: UpdateTaxProfileDto): Promise<import("../../database/entities").TaxProfile>;
}
