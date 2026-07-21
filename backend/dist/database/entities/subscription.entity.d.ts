import { AppBaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
export declare enum SubscriptionPlan {
    FREE = "free",
    BASIC = "basic",
    PROFESSIONAL = "professional",
    ENTERPRISE = "enterprise"
}
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PAST_DUE = "past_due",
    CANCELLED = "cancelled",
    TRIAL = "trial"
}
export declare class Subscription extends AppBaseEntity {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    maxClients: number;
    maxUsers: number;
    price: number;
    stripeSubscriptionId?: string;
    trialEndsAt?: Date;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    features?: Record<string, boolean>;
    tenantId: string;
    tenant: Tenant;
}
