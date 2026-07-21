import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaxProfileDto {
  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rut?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasIngresosLaborales?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasIngresosIndependientes?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasRendimientosFinancieros?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasPropiedades?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasVehiculos?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasInversiones?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasDependientes?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasMedicinaPrepaga?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasCreditoHipotecario?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  ingresosAnuales?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  patrimonioBruto?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  taxYear?: number;
}

export class UpdateTaxProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rut?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasIngresosLaborales?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasIngresosIndependientes?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasRendimientosFinancieros?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasPropiedades?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasVehiculos?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasInversiones?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasDependientes?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasMedicinaPrepaga?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasCreditoHipotecario?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  ingresosAnuales?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  patrimonioBruto?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  taxYear?: number;
}
