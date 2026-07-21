import { Repository } from 'typeorm';
import { Subscription } from '../../database/entities/subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/billing.dto';
export declare class BillingService {
    private readonly subscriptionRepository;
    constructor(subscriptionRepository: Repository<Subscription>);
    createSubscription(dto: CreateSubscriptionDto): Promise<Subscription>;
    findByTenant(tenantId: string): Promise<Subscription>;
    updateSubscription(id: string, dto: UpdateSubscriptionDto): Promise<Subscription>;
}
