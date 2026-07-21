import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClientStatus } from '../../../database/entities/client.entity';

export class CreateClientDto {
  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Mendoza' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @MinLength(5)
  documentNumber: string;

  @ApiProperty({ required: false, example: 'CC' })
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiProperty({ example: 'carlos@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false, example: '+573001234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'Calle 123 #45-67' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: 'Bogotá' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false, example: 'Colombiana' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateClientDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ required: false, enum: ClientStatus })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assignedToId?: string;
}

export class ClientQueryDto {
  @ApiProperty({ required: false, enum: ClientStatus })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
