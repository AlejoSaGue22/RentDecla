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
exports.TaxProfile = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const client_entity_1 = require("./client.entity");
let TaxProfile = class TaxProfile extends base_entity_1.AppBaseEntity {
    rut;
    hasIngresosLaborales;
    hasIngresosIndependientes;
    hasRendimientosFinancieros;
    hasPropiedades;
    hasVehiculos;
    hasInversiones;
    hasDependientes;
    hasMedicinaPrepaga;
    hasAportesVoluntarios;
    hasCreditoHipotecario;
    ingresosAnuales;
    patrimonioBruto;
    propiedades;
    inversiones;
    dependientes;
    taxYear;
    metadata;
    client;
    clientId;
};
exports.TaxProfile = TaxProfile;
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], TaxProfile.prototype, "rut", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], TaxProfile.prototype, "hasIngresosLaborales", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], TaxProfile.prototype, "hasIngresosIndependientes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], TaxProfile.prototype, "hasRendimientosFinancieros", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], TaxProfile.prototype, "hasPropiedades", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], TaxProfile.prototype, "hasVehiculos", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], TaxProfile.prototype, "hasInversiones", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], TaxProfile.prototype, "hasDependientes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], TaxProfile.prototype, "hasMedicinaPrepaga", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], TaxProfile.prototype, "hasAportesVoluntarios", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], TaxProfile.prototype, "hasCreditoHipotecario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], TaxProfile.prototype, "ingresosAnuales", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], TaxProfile.prototype, "patrimonioBruto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], TaxProfile.prototype, "propiedades", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], TaxProfile.prototype, "inversiones", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], TaxProfile.prototype, "dependientes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], TaxProfile.prototype, "taxYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TaxProfile.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => client_entity_1.Client, (client) => client.taxProfile),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", client_entity_1.Client)
], TaxProfile.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.RelationId)((tp) => tp.client),
    __metadata("design:type", String)
], TaxProfile.prototype, "clientId", void 0);
exports.TaxProfile = TaxProfile = __decorate([
    (0, typeorm_1.Entity)('tax_profiles')
], TaxProfile);
//# sourceMappingURL=tax-profile.entity.js.map