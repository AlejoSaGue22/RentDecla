import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto, ClientQueryDto, ResendInvitationDto } from './dto/client.dto';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  create(@Body() dto: CreateClientDto, @TenantId() tenantId: string, @CurrentUser('id') userId: string) {
    return this.clientsService.create({ ...dto, tenantId, assignedToId: userId });
  }

  @Get()
  @ApiOperation({ summary: 'List clients' })
  findAll(@Query() query: ClientQueryDto, @TenantId() tenantId: string) {
    return this.clientsService.findAll(tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by id' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Get('document/:documentNumber')
  @ApiOperation({ summary: 'Find client by document number' })
  findByDocument(@Param('documentNumber') documentNumber: string) {
    return this.clientsService.findByDocument(documentNumber);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Post(':id/resend-invitation')
  @ApiOperation({ summary: 'Resend invitation email to client' })
  resendInvitation(@Param('id') id: string, @Body() dto?: ResendInvitationDto) {
    return this.clientsService.resendInvitation(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
