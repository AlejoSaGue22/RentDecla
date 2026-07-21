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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_entity_1 = require("../../database/entities/subscription.entity");
let BillingService = class BillingService {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async createSubscription(dto) {
        const existing = await this.subscriptionRepository.findOne({
            where: { tenantId: dto.tenantId },
        });
        if (existing) {
            Object.assign(existing, dto);
            return this.subscriptionRepository.save(existing);
        }
        const subscription = this.subscriptionRepository.create(dto);
        return this.subscriptionRepository.save(subscription);
    }
    async findByTenant(tenantId) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { tenantId },
        });
        if (!subscription)
            throw new common_1.NotFoundException('Subscription not found for this tenant');
        return subscription;
    }
    async updateSubscription(id, dto) {
        const subscription = await this.subscriptionRepository.findOne({ where: { id } });
        if (!subscription)
            throw new common_1.NotFoundException('Subscription not found');
        Object.assign(subscription, dto);
        return this.subscriptionRepository.save(subscription);
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BillingService);
//# sourceMappingURL=billing.service.js.map