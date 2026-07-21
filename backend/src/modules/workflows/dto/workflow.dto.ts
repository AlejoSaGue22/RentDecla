import { IsString, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkflowType, WorkflowStatus } from '../../../database/entities/workflow.entity';

export class CreateWorkflowDto {
  @ApiProperty({ enum: WorkflowType, default: WorkflowType.DECLARACION_RENTA })
  @IsOptional()
  @IsEnum(WorkflowType)
  type?: WorkflowType;

  @ApiProperty({ example: 2025 })
  @IsNumber()
  taxYear: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty()
  @IsString()
  clientId: string;
}

export class UpdateWorkflowDto {
  @ApiProperty({ required: false, enum: WorkflowType })
  @IsOptional()
  @IsEnum(WorkflowType)
  type?: WorkflowType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  taxYear?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class WorkflowQueryDto {
  @ApiProperty({ required: false, enum: WorkflowStatus })
  @IsOptional()
  @IsEnum(WorkflowStatus)
  status?: WorkflowStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  taxYear?: number;
}
