"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentReviewsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const document_reviews_controller_1 = require("./document-reviews.controller");
const document_reviews_service_1 = require("./document-reviews.service");
const document_review_entity_1 = require("../../database/entities/document-review.entity");
const document_entity_1 = require("../../database/entities/document.entity");
const client_entity_1 = require("../../database/entities/client.entity");
let DocumentReviewsModule = class DocumentReviewsModule {
};
exports.DocumentReviewsModule = DocumentReviewsModule;
exports.DocumentReviewsModule = DocumentReviewsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([document_review_entity_1.DocumentReview, document_entity_1.Document, client_entity_1.Client]),
        ],
        controllers: [document_reviews_controller_1.DocumentReviewsController, document_reviews_controller_1.ReviewsController],
        providers: [document_reviews_service_1.DocumentReviewsService],
        exports: [document_reviews_service_1.DocumentReviewsService],
    })
], DocumentReviewsModule);
//# sourceMappingURL=document-reviews.module.js.map