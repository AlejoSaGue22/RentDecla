"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ClientsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const client_entity_1 = require("../../database/entities/client.entity");
const mailer_service_1 = require("../mailer/mailer.service");
let ClientsService = ClientsService_1 = class ClientsService {
    clientRepository;
    mailerService;
    logger = new common_1.Logger(ClientsService_1.name);
    constructor(clientRepository, mailerService) {
        this.clientRepository = clientRepository;
        this.mailerService = mailerService;
    }
    async create(dto) {
        const existing = await this.clientRepository.findOne({
            where: [
                { documentNumber: dto.documentNumber },
                { email: dto.email },
            ],
        });
        if (existing)
            throw new common_1.ConflictException('Client with this document or email already exists');
        const invitationToken = (0, crypto_1.randomUUID)();
        const client = this.clientRepository.create({
            ...dto,
            status: client_entity_1.ClientStatus.PENDING_INVITATION,
            invitationToken,
            invitationSentAt: new Date(),
        });
        const saved = await this.clientRepository.save(client);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
        const invitationUrl = `${frontendUrl}/auth/accept-invitation?token=${invitationToken}`;
        this.mailerService.sendTemplateEmail(dto.email, 'Invitación a RentDecla - Completa tu registro', 'client-invitation', {
            clientName: `${dto.firstName} ${dto.lastName}`,
            invitationUrl,
        }).catch((err) => this.logger.error(`Failed to send invitation to ${dto.email}: ${err.message}`));
        return saved;
    }
    async findAll(tenantId, query) {
        let where = { tenantId };
        if (query.status)
            where.status = query.status;
        if (query.assignedToId)
            where.assignedToId = query.assignedToId;
        const search = query.search && query.search.trim() !== '' && query.search !== 'undefined' ? query.search.trim() : null;
        if (search) {
            const searchLike = (0, typeorm_2.Like)(`%${search}%`);
            where = [
                { tenantId, firstName: searchLike, ...(query.status ? { status: query.status } : {}), ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}) },
                { tenantId, lastName: searchLike, ...(query.status ? { status: query.status } : {}), ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}) },
                { tenantId, documentNumber: searchLike, ...(query.status ? { status: query.status } : {}), ...(query.assignedToId ? { assignedToId: query.assignedToId } : {}) },
            ];
        }
        return this.clientRepository.find({
            where,
            relations: { assignedTo: true, taxProfile: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const client = await this.clientRepository.findOne({
            where: { id },
            relations: { assignedTo: true, taxProfile: true, documents: true, workflows: true, documentRequests: true },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return client;
    }
    async findByDocument(documentNumber) {
        const client = await this.clientRepository.findOne({
            where: { documentNumber },
            relations: { assignedTo: true, taxProfile: true },
        });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return client;
    }
    async update(id, dto) {
        const client = await this.findOne(id);
        Object.assign(client, dto);
        return this.clientRepository.save(client);
    }
    async resendInvitation(id, dto) {
        const client = await this.findOne(id);
        if (client.status !== client_entity_1.ClientStatus.PENDING_INVITATION) {
            throw new common_1.BadRequestException('The client status must be pending invitation to resend');
        }
        if (dto?.email && dto.email !== client.email) {
            const existing = await this.clientRepository.findOne({ where: { email: dto.email } });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Another client with this email already exists');
            }
            client.email = dto.email;
        }
        client.invitationToken = (0, crypto_1.randomUUID)();
        client.invitationSentAt = new Date();
        const saved = await this.clientRepository.save(client);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
        const invitationUrl = `${frontendUrl}/auth/accept-invitation?token=${client.invitationToken}`;
        this.mailerService.sendTemplateEmail(client.email, 'Invitación a RentDecla - Completa tu registro', 'client-invitation', {
            clientName: `${client.firstName} ${client.lastName}`,
            invitationUrl,
        }).catch((err) => this.logger.error(`Failed to resend invitation to ${client.email}: ${err.message}`));
        return saved;
    }
    async remove(id) {
        const client = await this.findOne(id);
        client.status = client_entity_1.ClientStatus.ARCHIVED;
        return this.clientRepository.save(client);
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = ClientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mailer_service_1.MailerService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map