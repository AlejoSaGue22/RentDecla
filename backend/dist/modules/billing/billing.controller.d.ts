import { BillingService } from './billing.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/billing.dto';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    createSubscription(dto: CreateSubscriptionDto): Promise<import("../../database/entities").Subscription>;
    getSubscription(tenantId: string): Promise<import("../../database/entities").Subscription>;
    updateSubscription(id: string, dto: UpdateSubscriptionDto): Promise<import("../../database/entities").Subscription>;
}
