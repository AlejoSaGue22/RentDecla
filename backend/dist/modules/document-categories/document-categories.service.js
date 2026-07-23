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
exports.DocumentCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_category_entity_1 = require("../../database/entities/document-category.entity");
let DocumentCategoriesService = class DocumentCategoriesService {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(dto) {
        const category = this.categoryRepository.create(dto);
        return this.categoryRepository.save(category);
    }
    async findAll(tenantId) {
        const queryBuilder = this.categoryRepository.createQueryBuilder('category')
            .where('category.isActive = :isActive', { isActive: true });
        if (tenantId) {
            queryBuilder.andWhere('(category.tenantId IS NULL OR category.tenantId = :tenantId)', { tenantId });
        }
        else {
            queryBuilder.andWhere('category.tenantId IS NULL');
        }
        return queryBuilder.orderBy('category.name', 'ASC').getMany();
    }
    async findOne(id) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Document category not found');
        return category;
    }
    async update(id, dto) {
        const category = await this.findOne(id);
        Object.assign(category, dto);
        return this.categoryRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        category.isActive = false;
        return this.categoryRepository.save(category);
    }
};
exports.DocumentCategoriesService = DocumentCategoriesService;
exports.DocumentCategoriesService = DocumentCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_category_entity_1.DocumentCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentCategoriesService);
//# sourceMappingURL=document-categories.service.js.map