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
exports.DocumentCategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const document_categories_service_1 = require("./document-categories.service");
const document_category_dto_1 = require("./dto/document-category.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_decorator_2 = require("../../common/decorators/roles.decorator");
const tenant_id_decorator_1 = require("../../common/decorators/tenant-id.decorator");
let DocumentCategoriesController = class DocumentCategoriesController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    create(dto, tenantId) {
        return this.categoriesService.create({ ...dto, tenantId });
    }
    findAll(tenantId) {
        return this.categoriesService.findAll(tenantId);
    }
    findOne(id) {
        return this.categoriesService.findOne(id);
    }
    update(id, dto) {
        return this.categoriesService.update(id, dto);
    }
    remove(id) {
        return this.categoriesService.remove(id);
    }
};
exports.DocumentCategoriesController = DocumentCategoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN, roles_decorator_2.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a document category' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_category_dto_1.CreateDocumentCategoryDto, String]),
    __metadata("design:returntype", void 0)
], DocumentCategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN, roles_decorator_2.UserRole.SUPER_ADMIN, roles_decorator_2.UserRole.CONTADOR, roles_decorator_2.UserRole.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'List active document categories' }),
    __param(0, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentCategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN, roles_decorator_2.UserRole.SUPER_ADMIN, roles_decorator_2.UserRole.CONTADOR, roles_decorator_2.UserRole.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get a document category by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentCategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN, roles_decorator_2.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a document category' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, document_category_dto_1.UpdateDocumentCategoryDto]),
    __metadata("design:returntype", void 0)
], DocumentCategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.ADMIN, roles_decorator_2.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete/deactivate a document category' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentCategoriesController.prototype, "remove", null);
exports.DocumentCategoriesController = DocumentCategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Categorías de Documentos'),
    (0, common_1.Controller)('document-categories'),
    __metadata("design:paramtypes", [document_categories_service_1.DocumentCategoriesService])
], DocumentCategoriesController);
//# sourceMappingURL=document-categories.controller.js.map