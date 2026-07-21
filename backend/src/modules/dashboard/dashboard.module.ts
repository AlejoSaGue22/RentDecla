import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Client } from '../../database/entities/client.entity';
import { Workflow } from '../../database/entities/workflow.entity';
import { Document } from '../../database/entities/document.entity';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Workflow, Document, User])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
