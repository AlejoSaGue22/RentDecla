import { SubscriptionPlan, SubscriptionStatus } from '../../../database/entities/subscription.entity';
export declare class CreateSubscriptionDto {
    tenantId: string;
    plan?: SubscriptionPlan;
    maxClients?: number;
    maxUsers?: number;
    price?: number;
    features?: Record<string, boolean>;
}
export declare class UpdateSubscriptionDto {
    plan?: SubscriptionPlan;
    status?: SubscriptionStatus;
    maxClients?: number;
    maxUsers?: number;
    price?: number;
}
