import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto, ClientQueryDto } from './dto/client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(dto: CreateClientDto, tenantId: string, userId: string): Promise<import("../../database/entities").Client>;
    findAll(query: ClientQueryDto, tenantId: string): Promise<import("../../database/entities").Client[]>;
    findOne(id: string): Promise<import("../../database/entities").Client>;
    findByDocument(documentNumber: string): Promise<import("../../database/entities").Client>;
    update(id: string, dto: UpdateClientDto): Promise<import("../../database/entities").Client>;
    remove(id: string): Promise<import("../../database/entities").Client>;
}
