import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentCategory } from '../../database/entities/document-category.entity';
import { CreateDocumentCategoryDto, UpdateDocumentCategoryDto } from './dto/document-category.dto';

@Injectable()
export class DocumentCategoriesService {
  constructor(
    @InjectRepository(DocumentCategory)
    private readonly categoryRepository: Repository<DocumentCategory>,
  ) {}

  async create(dto: CreateDocumentCategoryDto & { tenantId?: string }) {
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async findAll(tenantId?: string) {
    // Return active categories that are either global (tenantId is null) or specific to the tenant
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .where('category.isActive = :isActive', { isActive: true });

    if (tenantId) {
      queryBuilder.andWhere(
        '(category.tenantId IS NULL OR category.tenantId = :tenantId)',
        { tenantId },
      );
    } else {
      queryBuilder.andWhere('category.tenantId IS NULL');
    }

    return queryBuilder.orderBy('category.name', 'ASC').getMany();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Document category not found');
    return category;
  }

  async update(id: string, dto: UpdateDocumentCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    category.isActive = false;
    return this.categoryRepository.save(category);
  }
}
