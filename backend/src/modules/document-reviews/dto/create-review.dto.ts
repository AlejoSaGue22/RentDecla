import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewDecision } from '../../../database/entities/document-review.entity';

export class CreateReviewDto {
  @ApiProperty({ enum: ReviewDecision, example: ReviewDecision.APPROVED })
  @IsEnum(ReviewDecision)
  decision: ReviewDecision;

  @ApiProperty({ required: false, example: 'Documento válido y completo' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}
