import { Repository } from 'typeorm';
import { DocumentCategory } from '../../database/entities/document-category.entity';
import { CreateDocumentCategoryDto, UpdateDocumentCategoryDto } from './dto/document-category.dto';
export declare class DocumentCategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<DocumentCategory>);
    create(dto: CreateDocumentCategoryDto & {
        tenantId?: string;
    }): Promise<DocumentCategory>;
    findAll(tenantId?: string): Promise<DocumentCategory[]>;
    findOne(id: string): Promise<DocumentCategory>;
    update(id: string, dto: UpdateDocumentCategoryDto): Promise<DocumentCategory>;
    remove(id: string): Promise<DocumentCategory>;
}
