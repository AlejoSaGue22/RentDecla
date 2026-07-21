import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan, SubscriptionStatus } from '../../../database/entities/subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsString()
  tenantId: string;

  @ApiProperty({ enum: SubscriptionPlan, default: SubscriptionPlan.FREE })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxClients?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxUsers?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  features?: Record<string, boolean>;
}

export class UpdateSubscriptionDto {
  @ApiProperty({ required: false, enum: SubscriptionPlan })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;

  @ApiProperty({ required: false, enum: SubscriptionStatus })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxClients?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxUsers?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;
}
