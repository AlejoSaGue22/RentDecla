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
exports.WorkflowsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const workflow_entity_1 = require("../../database/entities/workflow.entity");
const notification_service_1 = require("../notifications/notification.service");
let WorkflowsService = class WorkflowsService {
    workflowRepository;
    notificationService;
    constructor(workflowRepository, notificationService) {
        this.workflowRepository = workflowRepository;
        this.notificationService = notificationService;
    }
    async create(dto) {
        const workflow = this.workflowRepository.create(dto);
        return this.workflowRepository.save(workflow);
    }
    async findAll(tenantId, query) {
        const where = { tenantId };
        if (query.status)
            where.status = query.status;
        if (query.clientId)
            where.clientId = query.clientId;
        if (query.taxYear)
            where.taxYear = query.taxYear;
        return this.workflowRepository.find({
            where,
            relations: { client: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findByClient(clientId) {
        return this.workflowRepository.find({
            where: { clientId },
            order: { taxYear: 'DESC' },
        });
    }
    async findOne(id) {
        const workflow = await this.workflowRepository.findOne({
            where: { id },
            relations: { client: { taxProfile: true } },
        });
        if (!workflow)
            throw new common_1.NotFoundException('Workflow not found');
        return workflow;
    }
    async updateStatus(id, status) {
        const workflow = await this.findOne(id);
        workflow.status = status;
        if (status === workflow_entity_1.WorkflowStatus.IN_PROGRESS && !workflow.startedAt) {
            workflow.startedAt = new Date();
        }
        if (status === workflow_entity_1.WorkflowStatus.COMPLETED) {
            workflow.completedAt = new Date();
            if (workflow.client) {
                await this.notificationService.notifyWorkflowCompleted(workflow.client, workflow.taxYear);
            }
        }
        return this.workflowRepository.save(workflow);
    }
    async update(id, dto) {
        const workflow = await this.findOne(id);
        Object.assign(workflow, dto);
        return this.workflowRepository.save(workflow);
    }
    async remove(id) {
        const workflow = await this.findOne(id);
        workflow.status = workflow_entity_1.WorkflowStatus.CANCELLED;
        return this.workflowRepository.save(workflow);
    }
};
exports.WorkflowsService = WorkflowsService;
exports.WorkflowsService = WorkflowsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workflow_entity_1.Workflow)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], WorkflowsService);
//# sourceMappingURL=workflows.service.js.map