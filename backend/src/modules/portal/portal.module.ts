import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PortalController } from './portal.controller';
import { PortalService } from './portal.service';
import { Client } from '../../database/entities/client.entity';
import { TaxProfile } from '../../database/entities/tax-profile.entity';
import { Document } from '../../database/entities/document.entity';
import { DocumentRequest } from '../../database/entities/document-request.entity';
import { Workflow } from '../../database/entities/workflow.entity';
import { Notification } from '../../database/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      TaxProfile,
      Document,
      DocumentRequest,
      Workflow,
      Notification,
    ]),
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [PortalController],
  providers: [PortalService],
})
export class PortalModule {}
