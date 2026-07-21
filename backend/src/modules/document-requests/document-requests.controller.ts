import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DocumentRequestsService } from './document-requests.service';
import { CreateDocumentRequestDto, UpdateDocumentRequestDto } from './dto/document-request.dto';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('Document Requests')
@Controller('document-requests')
export class DocumentRequestsController {
  constructor(private readonly documentRequestsService: DocumentRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create document request for a client' })
  create(@Body() dto: CreateDocumentRequestDto, @TenantId() tenantId: string) {
    return this.documentRequestsService.create({ ...dto, tenantId });
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get document requests by client' })
  findByClient(@Param('clientId') clientId: string) {
    return this.documentRequestsService.findByClient(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document request by id' })
  findOne(@Param('id') id: string) {
    return this.documentRequestsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document request' })
  update(@Param('id') id: string, @Body() dto: UpdateDocumentRequestDto) {
    return this.documentRequestsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document request' })
  remove(@Param('id') id: string) {
    return this.documentRequestsService.remove(id);
  }
}
