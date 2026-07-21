import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, UpdateWorkflowDto, WorkflowQueryDto } from './dto/workflow.dto';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('Workflows')
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a workflow for a client' })
  create(@Body() dto: CreateWorkflowDto, @TenantId() tenantId: string) {
    return this.workflowsService.create({ ...dto, tenantId });
  }

  @Get()
  @ApiOperation({ summary: 'List workflows' })
  findAll(@Query() query: WorkflowQueryDto, @TenantId() tenantId: string) {
    return this.workflowsService.findAll(tenantId, query);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get workflows by client' })
  findByClient(@Param('clientId') clientId: string) {
    return this.workflowsService.findByClient(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow by id' })
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update workflow status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.workflowsService.updateStatus(id, status);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workflow' })
  update(@Param('id') id: string, @Body() dto: UpdateWorkflowDto) {
    return this.workflowsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workflow' })
  remove(@Param('id') id: string) {
    return this.workflowsService.remove(id);
  }
}
