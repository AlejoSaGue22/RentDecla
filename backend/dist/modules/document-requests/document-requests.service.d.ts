import { Repository } from 'typeorm';
import { DocumentRequest } from '../../database/entities/document-request.entity';
import { CreateDocumentRequestDto, UpdateDocumentRequestDto } from './dto/document-request.dto';
export declare class DocumentRequestsService {
    private readonly documentRequestRepository;
    constructor(documentRequestRepository: Repository<DocumentRequest>);
    create(dto: CreateDocumentRequestDto & {
        tenantId: string;
    }): Promise<DocumentRequest>;
    findByClient(clientId: string): Promise<DocumentRequest[]>;
    findOne(id: string): Promise<DocumentRequest>;
    update(id: string, dto: UpdateDocumentRequestDto): Promise<DocumentRequest>;
    remove(id: string): Promise<DocumentRequest>;
}
