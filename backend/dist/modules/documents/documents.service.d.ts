import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Document } from '../../database/entities/document.entity';
import { Client } from '../../database/entities/client.entity';
import { NotificationService } from '../notifications/notification.service';
export declare class DocumentsService {
    private readonly documentRepository;
    private readonly clientRepository;
    private readonly notificationService;
    constructor(documentRepository: Repository<Document>, clientRepository: Repository<Client>, notificationService: NotificationService);
    upload(file: Express.Multer.File, metadata: {
        clientId: string;
        category?: string;
        description?: string;
        documentRequestId?: string;
    }): Promise<Document>;
    findByClient(clientId: string): Promise<Document[]>;
    findOne(id: string): Promise<Document>;
    getFileStream(id: string): Promise<{
        stream: fs.ReadStream;
        mimeType: string;
        originalName: string;
    }>;
    update(id: string, dto: Partial<Document>): Promise<Document>;
    remove(id: string): Promise<Document>;
}
