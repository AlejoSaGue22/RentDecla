import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../database/entities/subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/billing.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async createSubscription(dto: CreateSubscriptionDto) {
    const existing = await this.subscriptionRepository.findOne({
      where: { tenantId: dto.tenantId },
    });
    if (existing) {
      Object.assign(existing, dto);
      return this.subscriptionRepository.save(existing);
    }
    const subscription = this.subscriptionRepository.create(dto);
    return this.subscriptionRepository.save(subscription);
  }

  async findByTenant(tenantId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { tenantId },
    });
    if (!subscription) throw new NotFoundException('Subscription not found for this tenant');
    return subscription;
  }

  async updateSubscription(id: string, dto: UpdateSubscriptionDto) {
    const subscription = await this.subscriptionRepository.findOne({ where: { id } });
    if (!subscription) throw new NotFoundException('Subscription not found');
    Object.assign(subscription, dto);
    return this.subscriptionRepository.save(subscription);
  }
}
