import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../../../database/entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ enum: NotificationType, default: NotificationType.EMAIL })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}
