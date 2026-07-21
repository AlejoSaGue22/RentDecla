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
exports.Client = exports.ClientStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const user_entity_1 = require("./user.entity");
const tax_profile_entity_1 = require("./tax-profile.entity");
const document_entity_1 = require("./document.entity");
const document_request_entity_1 = require("./document-request.entity");
const workflow_entity_1 = require("./workflow.entity");
const notification_entity_1 = require("./notification.entity");
var ClientStatus;
(function (ClientStatus) {
    ClientStatus["PENDING_INVITATION"] = "pending_invitation";
    ClientStatus["PENDING_PROFILE"] = "pending_profile";
    ClientStatus["PENDING_DOCUMENTS"] = "pending_documents";
    ClientStatus["IN_REVIEW"] = "in_review";
    ClientStatus["REQUIRES_CORRECTION"] = "requires_correction";
    ClientStatus["COMPLETED"] = "completed";
    ClientStatus["ARCHIVED"] = "archived";
})(ClientStatus || (exports.ClientStatus = ClientStatus = {}));
let Client = class Client extends base_entity_1.AppBaseEntity {
    firstName;
    lastName;
    documentNumber;
    documentType;
    email;
    phone;
    address;
    city;
    nationality;
    status;
    invitationSentAt;
    invitationAcceptedAt;
    notes;
    tenantId;
    assignedToId;
    tenant;
    assignedTo;
    taxProfile;
    documents;
    documentRequests;
    workflows;
    notifications;
};
exports.Client = Client;
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Client.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Client.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    __metadata("design:type", String)
], Client.prototype, "documentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "documentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150, unique: true }),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ClientStatus,
        default: ClientStatus.PENDING_INVITATION,
    }),
    __metadata("design:type", String)
], Client.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Client.prototype, "invitationSentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Client.prototype, "invitationAcceptedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], Client.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Client.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "assignedToId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.clients),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Client.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.assignedClients, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedToId' }),
    __metadata("design:type", user_entity_1.User)
], Client.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => tax_profile_entity_1.TaxProfile, (tp) => tp.client, { cascade: true }),
    __metadata("design:type", tax_profile_entity_1.TaxProfile)
], Client.prototype, "taxProfile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.Document, (doc) => doc.client),
    __metadata("design:type", Array)
], Client.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_request_entity_1.DocumentRequest, (dr) => dr.client),
    __metadata("design:type", Array)
], Client.prototype, "documentRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workflow_entity_1.Workflow, (w) => w.client),
    __metadata("design:type", Array)
], Client.prototype, "workflows", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (n) => n.client),
    __metadata("design:type", Array)
], Client.prototype, "notifications", void 0);
exports.Client = Client = __decorate([
    (0, typeorm_1.Entity)('clients')
], Client);
//# sourceMappingURL=client.entity.js.map