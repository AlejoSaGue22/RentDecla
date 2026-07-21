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
exports.Tenant = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const client_entity_1 = require("./client.entity");
const document_request_entity_1 = require("./document-request.entity");
const workflow_entity_1 = require("./workflow.entity");
const notification_entity_1 = require("./notification.entity");
const subscription_entity_1 = require("./subscription.entity");
let Tenant = class Tenant extends base_entity_1.AppBaseEntity {
    name;
    slug;
    logoUrl;
    primaryColor;
    documentPrefix;
    isActive;
    settings;
    users;
    clients;
    documentRequests;
    workflows;
    notifications;
    subscriptions;
};
exports.Tenant = Tenant;
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Tenant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 100 }),
    __metadata("design:type", String)
], Tenant.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], Tenant.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], Tenant.prototype, "primaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], Tenant.prototype, "documentPrefix", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Tenant.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Tenant.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => client_entity_1.Client, (client) => client.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "clients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_request_entity_1.DocumentRequest, (dr) => dr.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "documentRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workflow_entity_1.Workflow, (w) => w.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "workflows", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (n) => n.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subscription_entity_1.Subscription, (s) => s.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "subscriptions", void 0);
exports.Tenant = Tenant = __decorate([
    (0, typeorm_1.Entity)('tenants')
], Tenant);
//# sourceMappingURL=tenant.entity.js.map