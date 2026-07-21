import {
  Controller, Get, Post, Body, Param, Patch, Delete,
  UseInterceptors, UploadedFile, Query, Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import type { Response } from 'express';
import { DocumentsService } from './documents.service';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a document' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('clientId') clientId: string,
    @Body('category') category: string,
    @Body('description') description: string,
    @Body('documentRequestId') documentRequestId: string,
  ) {
    return this.documentsService.upload(file, {
      clientId, category, description, documentRequestId,
    });
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get documents by client' })
  findByClient(@Param('clientId') clientId: string) {
    return this.documentsService.findByClient(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by id' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download document' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const { stream, mimeType, originalName } = await this.documentsService.getFileStream(id);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
    stream.pipe(res);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document metadata' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.documentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
