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
exports.TaxProfilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tax_profile_entity_1 = require("../../database/entities/tax-profile.entity");
let TaxProfilesService = class TaxProfilesService {
    taxProfileRepository;
    constructor(taxProfileRepository) {
        this.taxProfileRepository = taxProfileRepository;
    }
    async create(dto) {
        const existing = await this.taxProfileRepository.findOne({
            where: { clientId: dto.clientId },
        });
        if (existing) {
            Object.assign(existing, dto);
            return this.taxProfileRepository.save(existing);
        }
        const profile = this.taxProfileRepository.create(dto);
        return this.taxProfileRepository.save(profile);
    }
    async findByClient(clientId) {
        const profile = await this.taxProfileRepository.findOne({
            where: { clientId },
            relations: { client: true },
        });
        if (!profile)
            throw new common_1.NotFoundException('Tax profile not found for this client');
        return profile;
    }
    async update(id, dto) {
        const profile = await this.taxProfileRepository.findOne({ where: { id } });
        if (!profile)
            throw new common_1.NotFoundException('Tax profile not found');
        Object.assign(profile, dto);
        return this.taxProfileRepository.save(profile);
    }
};
exports.TaxProfilesService = TaxProfilesService;
exports.TaxProfilesService = TaxProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tax_profile_entity_1.TaxProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaxProfilesService);
//# sourceMappingURL=tax-profiles.service.js.map