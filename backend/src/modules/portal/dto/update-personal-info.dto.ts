import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePersonalInfoDto {
  @ApiProperty({ required: false, example: '+573001234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'Calle 123 #45-67' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  address?: string;

  @ApiProperty({ required: false, example: 'Bogotá' })
  @IsOptional()
  @IsString()
  city?: string;
}
