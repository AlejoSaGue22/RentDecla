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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_entity_1 = require("../../database/entities/client.entity");
let ClientsService = class ClientsService {
    clientRepository;
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
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
        const client = this.clientRepository.create({
            ...dto,
            status: client_entity_1.ClientStatus.PENDING_INVITATION,
        });
        return this.clientRepository.save(client);
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
    async remove(id) {
        const client = await this.findOne(id);
        client.status = client_entity_1.ClientStatus.ARCHIVED;
        return this.clientRepository.save(client);
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientsService);
//# sourceMappingURL=clients.service.js.map