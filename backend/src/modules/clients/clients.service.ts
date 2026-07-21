import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Client, ClientStatus } from '../../database/entities/client.entity';
import { CreateClientDto, UpdateClientDto, ClientQueryDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(dto: CreateClientDto & { tenantId: string; assignedToId?: string }) {
    const existing = await this.clientRepository.findOne({
      where: [
        { documentNumber: dto.documentNumber },
        { email: dto.email },
      ],
    });
    if (existing) throw new ConflictException('Client with this document or email already exists');

    const client = this.clientRepository.create({
      ...dto,
      status: ClientStatus.PENDING_INVITATION,
    });
    return this.clientRepository.save(client);
  }

  async findAll(tenantId: string, query: ClientQueryDto) {
    let where: any = { tenantId };
    if (query.status) where.status = query.status;
    if (query.assignedToId) where.assignedToId = query.assignedToId;

    const search = query.search && query.search.trim() !== '' && query.search !== 'undefined' ? query.search.trim() : null;

    if (search) {
      const searchLike = Like(`%${search}%`);
      where = [
        { tenantId, firstName: searchLike, ...(query.status ? { status: query.status } : {}), ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}) },
        { tenantId, lastName: searchLike, ...(query.status ? { status: query.status } : {}), ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}) },
        { tenantId, documentNumber: searchLike, ...(query.status ? { status: query.status } : {}), ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}) },
      ];
    }

    return this.clientRepository.find({
      where,
      relations: { assignedTo: true, taxProfile: true },
      order: { createdAt: 'DESC' as const },
    });
  }

  async findOne(id: string) {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: { assignedTo: true, taxProfile: true, documents: true, workflows: true, documentRequests: true },
    });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async findByDocument(documentNumber: string) {
    const client = await this.clientRepository.findOne({
      where: { documentNumber },
      relations: { assignedTo: true, taxProfile: true },
    });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    const client = await this.findOne(id);
    Object.assign(client, dto);
    return this.clientRepository.save(client);
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    client.status = ClientStatus.ARCHIVED;
    return this.clientRepository.save(client);
  }
}
