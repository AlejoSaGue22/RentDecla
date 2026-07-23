import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { Document } from '../../database/entities/document.entity';
import { Client } from '../../database/entities/client.entity';
import { NotificationService } from '../notifications/notification.service';
import { getStoragePath } from '../../common/utils/storage-path.util';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly notificationService: NotificationService,
  ) {}

  async upload(file: Express.Multer.File, metadata: {
    clientId: string;
    category?: string;
    description?: string;
    documentRequestId?: string;
  }) {
    if (!file) throw new BadRequestException('File is required');

    const client = await this.clientRepository.findOne({
      where: { id: metadata.clientId },
      relations: { tenant: true },
    });
    if (!client) throw new NotFoundException('Client not found');

    const fileName = `${Date.now()}-${file.originalname}`;
    const { filePath, fileUrl } = getStoragePath(client, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const document = this.documentRepository.create({
      originalName: file.originalname,
      filePath,
      fileUrl,
      mimeType: file.mimetype,
      fileSize: file.size,
      clientId: metadata.clientId,
      category: metadata.category,
      description: metadata.description,
      documentRequestId: metadata.documentRequestId,
    });

    const savedDocument = await this.documentRepository.save(document);

    await this.notificationService.notifyDocumentUploaded(savedDocument, client);

    return savedDocument;
  }

  async findByClient(clientId: string) {
    return this.documentRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' as const },
    });
  }

  async findOne(id: string) {
    const doc = await this.documentRepository.findOne({
      where: { id },
      relations: { reviews: { reviewedBy: true } },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async getFileStream(id: string) {
    const doc = await this.findOne(id);
    if (!fs.existsSync(doc.filePath)) {
      throw new NotFoundException('File not found on disk');
    }
    const stream = fs.createReadStream(doc.filePath);
    return { stream, mimeType: doc.mimeType, originalName: doc.originalName };
  }

  async update(id: string, dto: Partial<Document>) {
    const doc = await this.findOne(id);
    Object.assign(doc, dto);
    return this.documentRepository.save(doc);
  }

  async remove(id: string) {
    const doc = await this.findOne(id);
    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }
    return this.documentRepository.softRemove(doc);
  }
}
