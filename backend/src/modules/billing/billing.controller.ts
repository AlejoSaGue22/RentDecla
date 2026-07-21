import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/billing.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/roles.decorator';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('subscriptions')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create subscription for tenant' })
  createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.billingService.createSubscription(dto);
  }

  @Get('subscriptions/tenant/:tenantId')
  @ApiOperation({ summary: 'Get subscription by tenant' })
  getSubscription(@Param('tenantId') tenantId: string) {
    return this.billingService.findByTenant(tenantId);
  }

  @Patch('subscriptions/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update subscription' })
  updateSubscription(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    return this.billingService.updateSubscription(id, dto);
  }
}
