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
exports.DocumentRequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const document_requests_service_1 = require("./document-requests.service");
const document_request_dto_1 = require("./dto/document-request.dto");
const tenant_id_decorator_1 = require("../../common/decorators/tenant-id.decorator");
let DocumentRequestsController = class DocumentRequestsController {
    documentRequestsService;
    constructor(documentRequestsService) {
        this.documentRequestsService = documentRequestsService;
    }
    create(dto, tenantId) {
        return this.documentRequestsService.create({ ...dto, tenantId });
    }
    findByClient(clientId) {
        return this.documentRequestsService.findByClient(clientId);
    }
    findOne(id) {
        return this.documentRequestsService.findOne(id);
    }
    update(id, dto) {
        return this.documentRequestsService.update(id, dto);
    }
    remove(id) {
        return this.documentRequestsService.remove(id);
    }
};
exports.DocumentRequestsController = DocumentRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create document request for a client' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_request_dto_1.CreateDocumentRequestDto, String]),
    __metadata("design:returntype", void 0)
], DocumentRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get document requests by client' }),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentRequestsController.prototype, "findByClient", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get document request by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update document request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, document_request_dto_1.UpdateDocumentRequestDto]),
    __metadata("design:returntype", void 0)
], DocumentRequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete document request' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentRequestsController.prototype, "remove", null);
exports.DocumentRequestsController = DocumentRequestsController = __decorate([
    (0, swagger_1.ApiTags)('Document Requests'),
    (0, common_1.Controller)('document-requests'),
    __metadata("design:paramtypes", [document_requests_service_1.DocumentRequestsService])
], DocumentRequestsController);
//# sourceMappingURL=document-requests.controller.js.map