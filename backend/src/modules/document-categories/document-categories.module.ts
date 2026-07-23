import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentCategory } from '../../database/entities/document-category.entity';
import { DocumentCategoriesService } from './document-categories.service';
import { DocumentCategoriesController } from './document-categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentCategory])],
  controllers: [DocumentCategoriesController],
  providers: [DocumentCategoriesService],
  exports: [DocumentCategoriesService],
})
export class DocumentCategoriesModule {}
