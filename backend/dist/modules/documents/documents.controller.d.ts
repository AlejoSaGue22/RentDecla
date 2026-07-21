import type { Response } from 'express';
import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    upload(file: Express.Multer.File, clientId: string, category: string, description: string, documentRequestId: string): Promise<import("../../database/entities").Document>;
    findByClient(clientId: string): Promise<import("../../database/entities").Document[]>;
    findOne(id: string): Promise<import("../../database/entities").Document>;
    download(id: string, res: Response): Promise<void>;
    update(id: string, dto: any): Promise<import("../../database/entities").Document>;
    remove(id: string): Promise<import("../../database/entities").Document>;
}
