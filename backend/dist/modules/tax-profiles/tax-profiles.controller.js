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
exports.TaxProfilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tax_profiles_service_1 = require("./tax-profiles.service");
const tax_profile_dto_1 = require("./dto/tax-profile.dto");
let TaxProfilesController = class TaxProfilesController {
    taxProfilesService;
    constructor(taxProfilesService) {
        this.taxProfilesService = taxProfilesService;
    }
    create(dto) {
        return this.taxProfilesService.create(dto);
    }
    findByClient(clientId) {
        return this.taxProfilesService.findByClient(clientId);
    }
    update(id, dto) {
        return this.taxProfilesService.update(id, dto);
    }
};
exports.TaxProfilesController = TaxProfilesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create tax profile for a client' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tax_profile_dto_1.CreateTaxProfileDto]),
    __metadata("design:returntype", void 0)
], TaxProfilesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tax profile by client' }),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxProfilesController.prototype, "findByClient", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tax profile' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tax_profile_dto_1.UpdateTaxProfileDto]),
    __metadata("design:returntype", void 0)
], TaxProfilesController.prototype, "update", null);
exports.TaxProfilesController = TaxProfilesController = __decorate([
    (0, swagger_1.ApiTags)('Tax Profiles'),
    (0, common_1.Controller)('tax-profiles'),
    __metadata("design:paramtypes", [tax_profiles_service_1.TaxProfilesService])
], TaxProfilesController);
//# sourceMappingURL=tax-profiles.controller.js.map