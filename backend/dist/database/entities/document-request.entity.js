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
exports.DocumentRequest = exports.RequestStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const client_entity_1 = require("./client.entity");
const document_entity_1 = require("./document.entity");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["PARTIALLY_UPLOADED"] = "partially_uploaded";
    RequestStatus["COMPLETED"] = "completed";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REQUIRES_CORRECTION"] = "requires_correction";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
let DocumentRequest = class DocumentRequest extends base_entity_1.AppBaseEntity {
    title;
    description;
    status;
    dueDate;
    priority;
    isRequired;
    tenantId;
    clientId;
    tenant;
    client;
    documents;
};
exports.DocumentRequest = DocumentRequest;
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], DocumentRequest.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DocumentRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], DocumentRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], DocumentRequest.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], DocumentRequest.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DocumentRequest.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentRequest.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentRequest.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.documentRequests),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], DocumentRequest.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, (client) => client.documentRequests),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", client_entity_1.Client)
], DocumentRequest.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.Document, (doc) => doc.documentRequest),
    __metadata("design:type", Array)
], DocumentRequest.prototype, "documents", void 0);
exports.DocumentRequest = DocumentRequest = __decorate([
    (0, typeorm_1.Entity)('document_requests')
], DocumentRequest);
//# sourceMappingURL=document-request.entity.js.map