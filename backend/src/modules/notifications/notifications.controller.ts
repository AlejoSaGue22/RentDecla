import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  create(@Body() dto: CreateNotificationDto, @TenantId() tenantId: string) {
    return this.notificationsService.create({ ...dto, tenantId });
  }

  @Get()
  @ApiOperation({ summary: 'List notifications for tenant' })
  findAll(@TenantId() tenantId: string, @Query('clientId') clientId?: string) {
    return this.notificationsService.findAll(tenantId, clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by id' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
