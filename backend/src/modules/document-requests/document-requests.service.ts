import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentRequest } from '../../database/entities/document-request.entity';
import { CreateDocumentRequestDto, UpdateDocumentRequestDto } from './dto/document-request.dto';

@Injectable()
export class DocumentRequestsService {
  constructor(
    @InjectRepository(DocumentRequest)
    private readonly documentRequestRepository: Repository<DocumentRequest>,
  ) {}

  async create(dto: CreateDocumentRequestDto & { tenantId: string }) {
    const request = this.documentRequestRepository.create(dto);
    return this.documentRequestRepository.save(request);
  }

  async findByClient(clientId: string) {
    return this.documentRequestRepository.find({
      where: { clientId },
      relations: { documents: true },
      order: { priority: 'DESC' as const, createdAt: 'DESC' as const },
    });
  }

  async findOne(id: string) {
    const request = await this.documentRequestRepository.findOne({
      where: { id },
      relations: { documents: true, client: true },
    });
    if (!request) throw new NotFoundException('Document request not found');
    return request;
  }

  async update(id: string, dto: UpdateDocumentRequestDto) {
    const request = await this.findOne(id);
    Object.assign(request, dto);
    return this.documentRequestRepository.save(request);
  }

  async remove(id: string) {
    const request = await this.findOne(id);
    return this.documentRequestRepository.softRemove(request);
  }
}
