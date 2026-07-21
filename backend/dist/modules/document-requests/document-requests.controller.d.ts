import { DocumentRequestsService } from './document-requests.service';
import { CreateDocumentRequestDto, UpdateDocumentRequestDto } from './dto/document-request.dto';
export declare class DocumentRequestsController {
    private readonly documentRequestsService;
    constructor(documentRequestsService: DocumentRequestsService);
    create(dto: CreateDocumentRequestDto, tenantId: string): Promise<import("../../database/entities").DocumentRequest>;
    findByClient(clientId: string): Promise<import("../../database/entities").DocumentRequest[]>;
    findOne(id: string): Promise<import("../../database/entities").DocumentRequest>;
    update(id: string, dto: UpdateDocumentRequestDto): Promise<import("../../database/entities").DocumentRequest>;
    remove(id: string): Promise<import("../../database/entities").DocumentRequest>;
}
