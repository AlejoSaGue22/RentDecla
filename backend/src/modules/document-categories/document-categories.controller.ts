import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DocumentCategoriesService } from './document-categories.service';
import { CreateDocumentCategoryDto, UpdateDocumentCategoryDto } from './dto/document-category.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/roles.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('Categorías de Documentos')
@Controller('document-categories')
export class DocumentCategoriesController {
  constructor(private readonly categoriesService: DocumentCategoriesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a document category' })
  create(@Body() dto: CreateDocumentCategoryDto, @TenantId() tenantId?: string) {
    return this.categoriesService.create({ ...dto, tenantId });
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTADOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'List active document categories' })
  findAll(@TenantId() tenantId?: string) {
    return this.categoriesService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTADOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get a document category by id' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a document category' })
  update(@Param('id') id: string, @Body() dto: UpdateDocumentCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft delete/deactivate a document category' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
