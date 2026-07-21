import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { TenantId } from '../../common/decorators/tenant-id.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getStats(@TenantId() tenantId: string) {
    return this.dashboardService.getStats(tenantId);
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get recent activity' })
  getRecentActivity(@TenantId() tenantId: string) {
    return this.dashboardService.getRecentActivity(tenantId);
  }
}
