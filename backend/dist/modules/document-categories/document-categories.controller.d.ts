import { DocumentCategoriesService } from './document-categories.service';
import { CreateDocumentCategoryDto, UpdateDocumentCategoryDto } from './dto/document-category.dto';
export declare class DocumentCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: DocumentCategoriesService);
    create(dto: CreateDocumentCategoryDto, tenantId?: string): Promise<import("../../database/entities").DocumentCategory>;
    findAll(tenantId?: string): Promise<import("../../database/entities").DocumentCategory[]>;
    findOne(id: string): Promise<import("../../database/entities").DocumentCategory>;
    update(id: string, dto: UpdateDocumentCategoryDto): Promise<import("../../database/entities").DocumentCategory>;
    remove(id: string): Promise<import("../../database/entities").DocumentCategory>;
}
