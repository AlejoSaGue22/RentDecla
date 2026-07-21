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
exports.WorkflowsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const workflows_service_1 = require("./workflows.service");
const workflow_dto_1 = require("./dto/workflow.dto");
const tenant_id_decorator_1 = require("../../common/decorators/tenant-id.decorator");
let WorkflowsController = class WorkflowsController {
    workflowsService;
    constructor(workflowsService) {
        this.workflowsService = workflowsService;
    }
    create(dto, tenantId) {
        return this.workflowsService.create({ ...dto, tenantId });
    }
    findAll(query, tenantId) {
        return this.workflowsService.findAll(tenantId, query);
    }
    findByClient(clientId) {
        return this.workflowsService.findByClient(clientId);
    }
    findOne(id) {
        return this.workflowsService.findOne(id);
    }
    updateStatus(id, status) {
        return this.workflowsService.updateStatus(id, status);
    }
    update(id, dto) {
        return this.workflowsService.update(id, dto);
    }
    remove(id) {
        return this.workflowsService.remove(id);
    }
};
exports.WorkflowsController = WorkflowsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a workflow for a client' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [workflow_dto_1.CreateWorkflowDto, String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List workflows' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [workflow_dto_1.WorkflowQueryDto, String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workflows by client' }),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "findByClient", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workflow by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update workflow status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update workflow' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, workflow_dto_1.UpdateWorkflowDto]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete workflow' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "remove", null);
exports.WorkflowsController = WorkflowsController = __decorate([
    (0, swagger_1.ApiTags)('Workflows'),
    (0, common_1.Controller)('workflows'),
    __metadata("design:paramtypes", [workflows_service_1.WorkflowsService])
], WorkflowsController);
//# sourceMappingURL=workflows.controller.js.map