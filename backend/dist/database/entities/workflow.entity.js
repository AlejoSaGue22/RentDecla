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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workflow = exports.WorkflowType = exports.WorkflowStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const client_entity_1 = require("./client.entity");
var WorkflowStatus;
(function (WorkflowStatus) {
    WorkflowStatus["NOT_STARTED"] = "not_started";
    WorkflowStatus["IN_PROGRESS"] = "in_progress";
    WorkflowStatus["AWAITING_DOCUMENTS"] = "awaiting_documents";
    WorkflowStatus["IN_REVIEW"] = "in_review";
    WorkflowStatus["COMPLETED"] = "completed";
    WorkflowStatus["CANCELLED"] = "cancelled";
})(WorkflowStatus || (exports.WorkflowStatus = WorkflowStatus = {}));
var WorkflowType;
(function (WorkflowType) {
    WorkflowType["DECLARACION_RENTA"] = "declaracion_renta";
    WorkflowType["DECLARACION_SIMPLIFICADA"] = "declaracion_simplificada";
    WorkflowType["CORRECCION"] = "correccion";
    WorkflowType["RECONSIDERACION"] = "reconsideracion";
})(WorkflowType || (exports.WorkflowType = WorkflowType = {}));
let Workflow = class Workflow extends base_entity_1.AppBaseEntity {
    type;
    status;
    taxYear;
    startedAt;
    completedAt;
    dueDate;
    progress;
    notes;
    tenantId;
    clientId;
    tenant;
    client;
};
exports.Workflow = Workflow;
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkflowType,
        default: WorkflowType.DECLARACION_RENTA,
    }),
    __metadata("design:type", String)
], Workflow.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkflowStatus,
        default: WorkflowStatus.NOT_STARTED,
    }),
    __metadata("design:type", String)
], Workflow.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Workflow.prototype, "taxYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Workflow.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Workflow.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Workflow.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Workflow.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], Workflow.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Workflow.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Workflow.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.workflows),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Workflow.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, (client) => client.workflows),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", client_entity_1.Client)
], Workflow.prototype, "client", void 0);
exports.Workflow = Workflow = __decorate([
    (0, typeorm_1.Entity)('workflows')
], Workflow);
//# sourceMappingURL=workflow.entity.js.map