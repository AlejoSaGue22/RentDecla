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
exports.DocumentReview = exports.ReviewDecision = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const document_entity_1 = require("./document.entity");
const user_entity_1 = require("./user.entity");
var ReviewDecision;
(function (ReviewDecision) {
    ReviewDecision["APPROVED"] = "approved";
    ReviewDecision["REJECTED"] = "rejected";
    ReviewDecision["REQUIRES_CORRECTION"] = "requires_correction";
})(ReviewDecision || (exports.ReviewDecision = ReviewDecision = {}));
let DocumentReview = class DocumentReview extends base_entity_1.AppBaseEntity {
    decision;
    comment;
    documentId;
    reviewedById;
    document;
    reviewedBy;
};
exports.DocumentReview = DocumentReview;
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReviewDecision,
    }),
    __metadata("design:type", String)
], DocumentReview.prototype, "decision", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DocumentReview.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentReview.prototype, "documentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentReview.prototype, "reviewedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => document_entity_1.Document, (doc) => doc.reviews),
    (0, typeorm_1.JoinColumn)({ name: 'documentId' }),
    __metadata("design:type", document_entity_1.Document)
], DocumentReview.prototype, "document", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.documentReviews),
    (0, typeorm_1.JoinColumn)({ name: 'reviewedById' }),
    __metadata("design:type", user_entity_1.User)
], DocumentReview.prototype, "reviewedBy", void 0);
exports.DocumentReview = DocumentReview = __decorate([
    (0, typeorm_1.Entity)('document_reviews')
], DocumentReview);
//# sourceMappingURL=document-review.entity.js.map