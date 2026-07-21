import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxProfile } from '../../database/entities/tax-profile.entity';
import { CreateTaxProfileDto, UpdateTaxProfileDto } from './dto/tax-profile.dto';

@Injectable()
export class TaxProfilesService {
  constructor(
    @InjectRepository(TaxProfile)
    private readonly taxProfileRepository: Repository<TaxProfile>,
  ) {}

  async create(dto: CreateTaxProfileDto) {
    const existing = await this.taxProfileRepository.findOne({
      where: { clientId: dto.clientId },
    });
    if (existing) {
      Object.assign(existing, dto);
      return this.taxProfileRepository.save(existing);
    }
    const profile = this.taxProfileRepository.create(dto);
    return this.taxProfileRepository.save(profile);
  }

  async findByClient(clientId: string) {
    const profile = await this.taxProfileRepository.findOne({
      where: { clientId },
      relations: { client: true },
    });
    if (!profile) throw new NotFoundException('Tax profile not found for this client');
    return profile;
  }

  async update(id: string, dto: UpdateTaxProfileDto) {
    const profile = await this.taxProfileRepository.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Tax profile not found');
    Object.assign(profile, dto);
    return this.taxProfileRepository.save(profile);
  }
}
