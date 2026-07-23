import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { randomUUID } from 'crypto';
import { Client, ClientStatus } from '../../database/entities/client.entity';
import { CreateClientDto, UpdateClientDto, ClientQueryDto, ResendInvitationDto } from './dto/client.dto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly mailerService: MailerService,
  ) {}

  async create(dto: CreateClientDto & { tenantId: string; assignedToId?: string }) {
    const existing = await this.clientRepository.findOne({
      where: [
        { documentNumber: dto.documentNumber },
        { email: dto.email },
      ],
    });
    if (existing) throw new ConflictException('Client with this document or email already exists');

    const invitationToken = randomUUID();

    const client = this.clientRepository.create({
      ...dto,
      status: ClientStatus.PENDING_INVITATION,
      invitationToken,
      invitationSentAt: new Date(),
    });
    const saved = await this.clientRepository.save(client);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const invitationUrl = `${frontendUrl}/auth/accept-invitation?token=${invitationToken}`;

    this.mailerService.sendTemplateEmail(
      dto.email,
      'Invitación a RentDecla - Completa tu registro',
      'client-invitation',
      {
        clientName: `${dto.firstName} ${dto.lastName}`,
        invitationUrl,
      },
    ).catch((err) => this.logger.error(`Failed to send invitation to ${dto.email}: ${err.message}`));

    return saved;
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

  async resendInvitation(id: string, dto?: ResendInvitationDto) {
    const client = await this.findOne(id);

    if (client.status !== ClientStatus.PENDING_INVITATION) {
      throw new BadRequestException('The client status must be pending invitation to resend');
    }

    if (dto?.email && dto.email !== client.email) {
      const existing = await this.clientRepository.findOne({ where: { email: dto.email } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Another client with this email already exists');
      }
      client.email = dto.email;
    }

    client.invitationToken = randomUUID();
    client.invitationSentAt = new Date();
    const saved = await this.clientRepository.save(client);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const invitationUrl = `${frontendUrl}/auth/accept-invitation?token=${client.invitationToken}`;

    this.mailerService.sendTemplateEmail(
      client.email,
      'Invitación a RentDecla - Completa tu registro',
      'client-invitation',
      {
        clientName: `${client.firstName} ${client.lastName}`,
        invitationUrl,
      },
    ).catch((err) => this.logger.error(`Failed to resend invitation to ${client.email}: ${err.message}`));

    return saved;
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    client.status = ClientStatus.ARCHIVED;
    return this.clientRepository.save(client);
  }
}
