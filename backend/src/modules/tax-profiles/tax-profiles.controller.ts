import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TaxProfilesService } from './tax-profiles.service';
import { CreateTaxProfileDto, UpdateTaxProfileDto } from './dto/tax-profile.dto';

@ApiTags('Tax Profiles')
@Controller('tax-profiles')
export class TaxProfilesController {
  constructor(private readonly taxProfilesService: TaxProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create tax profile for a client' })
  create(@Body() dto: CreateTaxProfileDto) {
    return this.taxProfilesService.create(dto);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get tax profile by client' })
  findByClient(@Param('clientId') clientId: string) {
    return this.taxProfilesService.findByClient(clientId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tax profile' })
  update(@Param('id') id: string, @Body() dto: UpdateTaxProfileDto) {
    return this.taxProfilesService.update(id, dto);
  }
}
