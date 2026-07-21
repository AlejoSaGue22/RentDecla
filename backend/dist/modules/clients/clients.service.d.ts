import { Repository } from 'typeorm';
import { Client } from '../../database/entities/client.entity';
import { CreateClientDto, UpdateClientDto, ClientQueryDto } from './dto/client.dto';
export declare class ClientsService {
    private readonly clientRepository;
    constructor(clientRepository: Repository<Client>);
    create(dto: CreateClientDto & {
        tenantId: string;
        assignedToId?: string;
    }): Promise<Client>;
    findAll(tenantId: string, query: ClientQueryDto): Promise<Client[]>;
    findOne(id: string): Promise<Client>;
    findByDocument(documentNumber: string): Promise<Client>;
    update(id: string, dto: UpdateClientDto): Promise<Client>;
    remove(id: string): Promise<Client>;
}
