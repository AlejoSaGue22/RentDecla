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
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const billing_service_1 = require("./billing.service");
const billing_dto_1 = require("./dto/billing.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_decorator_2 = require("../../common/decorators/roles.decorator");
let BillingController = class BillingController {
    billingService;
    constructor(billingService) {
        this.billingService = billingService;
    }
    createSubscription(dto) {
        return this.billingService.createSubscription(dto);
    }
    getSubscription(tenantId) {
        return this.billingService.findByTenant(tenantId);
    }
    updateSubscription(id, dto) {
        return this.billingService.updateSubscription(id, dto);
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('subscriptions'),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create subscription for tenant' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [billing_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Get)('subscriptions/tenant/:tenantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subscription by tenant' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "getSubscription", null);
__decorate([
    (0, common_1.Patch)('subscriptions/:id'),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update subscription' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, billing_dto_1.UpdateSubscriptionDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "updateSubscription", null);
exports.BillingController = BillingController = __decorate([
    (0, swagger_1.ApiTags)('Billing'),
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map