import { Repository } from 'typeorm';
import { Client } from '../../database/entities/client.entity';
import { CreateClientDto, UpdateClientDto, ClientQueryDto, ResendInvitationDto } from './dto/client.dto';
import { MailerService } from '../mailer/mailer.service';
export declare class ClientsService {
    private readonly clientRepository;
    private readonly mailerService;
    private readonly logger;
    constructor(clientRepository: Repository<Client>, mailerService: MailerService);
    create(dto: CreateClientDto & {
        tenantId: string;
        assignedToId?: string;
    }): Promise<Client>;
    findAll(tenantId: string, query: ClientQueryDto): Promise<Client[]>;
    findOne(id: string): Promise<Client>;
    findByDocument(documentNumber: string): Promise<Client>;
    update(id: string, dto: UpdateClientDto): Promise<Client>;
    resendInvitation(id: string, dto?: ResendInvitationDto): Promise<Client>;
    remove(id: string): Promise<Client>;
}
