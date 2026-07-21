import { Repository } from 'typeorm';
import { TaxProfile } from '../../database/entities/tax-profile.entity';
import { CreateTaxProfileDto, UpdateTaxProfileDto } from './dto/tax-profile.dto';
export declare class TaxProfilesService {
    private readonly taxProfileRepository;
    constructor(taxProfileRepository: Repository<TaxProfile>);
    create(dto: CreateTaxProfileDto): Promise<TaxProfile>;
    findByClient(clientId: string): Promise<TaxProfile>;
    update(id: string, dto: UpdateTaxProfileDto): Promise<TaxProfile>;
}
