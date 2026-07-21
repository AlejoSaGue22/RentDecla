import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DocumentReviewsController,
  ReviewsController,
} from './document-reviews.controller';
import { DocumentReviewsService } from './document-reviews.service';
import { DocumentReview } from '../../database/entities/document-review.entity';
import { Document } from '../../database/entities/document.entity';
import { Client } from '../../database/entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentReview, Document, Client]),
  ],
  controllers: [DocumentReviewsController, ReviewsController],
  providers: [DocumentReviewsService],
  exports: [DocumentReviewsService],
})
export class DocumentReviewsModule {}
