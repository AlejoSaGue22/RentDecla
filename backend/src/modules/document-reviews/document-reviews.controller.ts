import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DocumentReviewsService } from './document-reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Document Reviews')
@Controller('documents')
export class DocumentReviewsController {
  constructor(private readonly documentReviewsService: DocumentReviewsService) {}

  @Post(':id/review')
  @ApiOperation({ summary: 'Submit a document review' })
  @ApiResponse({ status: 201, description: 'Review created' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async review(
    @Param('id') documentId: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.documentReviewsService.create(documentId, userId, dto);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get review history for a document' })
  @ApiResponse({ status: 200, description: 'Review history' })
  findByDocument(@Param('id') documentId: string) {
    return this.documentReviewsService.findByDocument(documentId);
  }
}

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly documentReviewsService: DocumentReviewsService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Get pending document reviews' })
  @ApiResponse({ status: 200, description: 'Pending documents' })
  findPending() {
    return this.documentReviewsService.findPendingReviews();
  }
}
