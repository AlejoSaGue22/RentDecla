import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from '../../database/entities/document.entity';
import { Client } from '../../database/entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Client]),
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
