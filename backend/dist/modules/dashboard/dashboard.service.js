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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_entity_1 = require("../../database/entities/client.entity");
const workflow_entity_1 = require("../../database/entities/workflow.entity");
const document_entity_1 = require("../../database/entities/document.entity");
const user_entity_1 = require("../../database/entities/user.entity");
let DashboardService = class DashboardService {
    clientRepository;
    workflowRepository;
    documentRepository;
    userRepository;
    constructor(clientRepository, workflowRepository, documentRepository, userRepository) {
        this.clientRepository = clientRepository;
        this.workflowRepository = workflowRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }
    async getStats(tenantId) {
        const tenantCondition = tenantId ? { tenantId } : {};
        const totalClients = await this.clientRepository.count({ where: tenantCondition });
        const pendingClients = await this.clientRepository.count({
            where: { ...tenantCondition, status: client_entity_1.ClientStatus.PENDING_DOCUMENTS },
        });
        const completedClients = await this.clientRepository.count({
            where: { ...tenantCondition, status: client_entity_1.ClientStatus.COMPLETED },
        });
        const inReviewClients = await this.clientRepository.count({
            where: { ...tenantCondition, status: client_entity_1.ClientStatus.IN_REVIEW },
        });
        const activeWorkflows = await this.workflowRepository.count({
            where: { ...tenantCondition, status: workflow_entity_1.WorkflowStatus.IN_PROGRESS },
        });
        const completedWorkflows = await this.workflowRepository.count({
            where: { ...tenantCondition, status: workflow_entity_1.WorkflowStatus.COMPLETED },
        });
        const pendingDocuments = await this.documentRepository.count({
            where: { status: document_entity_1.DocumentStatus.PENDING },
        });
        const totalUsers = await this.userRepository.count({ where: tenantCondition });
        return {
            totalClients,
            pendingClients,
            completedClients,
            inReviewClients,
            activeWorkflows,
            completedWorkflows,
            pendingDocuments,
            totalUsers,
        };
    }
    async getRecentActivity(tenantId) {
        const where = tenantId ? { tenantId } : {};
        const recentClients = await this.clientRepository.find({
            where,
            order: { createdAt: 'DESC' },
            take: 10,
            relations: { assignedTo: true },
        });
        return recentClients.map((client) => ({
            type: 'client_created',
            description: `${client.firstName} ${client.lastName} was registered`,
            date: client.createdAt,
            status: client.status,
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(1, (0, typeorm_1.InjectRepository)(workflow_entity_1.Workflow)),
    __param(2, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map