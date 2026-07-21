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
exports.Document = exports.DocumentStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const document_request_entity_1 = require("./document-request.entity");
const client_entity_1 = require("./client.entity");
const document_review_entity_1 = require("./document-review.entity");
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "pending";
    DocumentStatus["UPLOADED"] = "uploaded";
    DocumentStatus["IN_REVIEW"] = "in_review";
    DocumentStatus["APPROVED"] = "approved";
    DocumentStatus["REJECTED"] = "rejected";
    DocumentStatus["REQUIRES_CORRECTION"] = "requires_correction";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
let Document = class Document extends base_entity_1.AppBaseEntity {
    originalName;
    filePath;
    fileUrl;
    mimeType;
    fileSize;
    category;
    description;
    version;
    status;
    rejectionReason;
    clientId;
    documentRequestId;
    client;
    documentRequest;
    reviews;
};
exports.Document = Document;
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Document.prototype, "originalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], Document.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Document.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Document.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], Document.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DocumentStatus,
        default: DocumentStatus.UPLOADED,
    }),
    __metadata("design:type", String)
], Document.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], Document.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Document.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "documentRequestId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, (client) => client.documents),
    (0, typeorm_1.JoinColumn)({ name: 'clientId' }),
    __metadata("design:type", client_entity_1.Client)
], Document.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => document_request_entity_1.DocumentRequest, (dr) => dr.documents, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'documentRequestId' }),
    __metadata("design:type", document_request_entity_1.DocumentRequest)
], Document.prototype, "documentRequest", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_review_entity_1.DocumentReview, (dr) => dr.document),
    __metadata("design:type", Array)
], Document.prototype, "reviews", void 0);
exports.Document = Document = __decorate([
    (0, typeorm_1.Entity)('documents')
], Document);
//# sourceMappingURL=document.entity.js.map