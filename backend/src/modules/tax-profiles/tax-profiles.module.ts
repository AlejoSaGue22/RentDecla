import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxProfilesController } from './tax-profiles.controller';
import { TaxProfilesService } from './tax-profiles.service';
import { TaxProfile } from '../../database/entities/tax-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaxProfile])],
  controllers: [TaxProfilesController],
  providers: [TaxProfilesService],
  exports: [TaxProfilesService],
})
export class TaxProfilesModule {}
