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
exports.ReviewsController = exports.DocumentReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const document_reviews_service_1 = require("./document-reviews.service");
const create_review_dto_1 = require("./dto/create-review.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let DocumentReviewsController = class DocumentReviewsController {
    documentReviewsService;
    constructor(documentReviewsService) {
        this.documentReviewsService = documentReviewsService;
    }
    async review(documentId, dto, userId) {
        return this.documentReviewsService.create(documentId, userId, dto);
    }
    findByDocument(documentId) {
        return this.documentReviewsService.findByDocument(documentId);
    }
};
exports.DocumentReviewsController = DocumentReviewsController;
__decorate([
    (0, common_1.Post)(':id/review'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a document review' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review created' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_review_dto_1.CreateReviewDto, String]),
    __metadata("design:returntype", Promise)
], DocumentReviewsController.prototype, "review", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get review history for a document' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review history' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentReviewsController.prototype, "findByDocument", null);
exports.DocumentReviewsController = DocumentReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Document Reviews'),
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [document_reviews_service_1.DocumentReviewsService])
], DocumentReviewsController);
let ReviewsController = class ReviewsController {
    documentReviewsService;
    constructor(documentReviewsService) {
        this.documentReviewsService = documentReviewsService;
    }
    findPending() {
        return this.documentReviewsService.findPendingReviews();
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending document reviews' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending documents' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findPending", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Reviews'),
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [document_reviews_service_1.DocumentReviewsService])
], ReviewsController);
//# sourceMappingURL=document-reviews.controller.js.map