import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentRequestsController } from './document-requests.controller';
import { DocumentRequestsService } from './document-requests.service';
import { DocumentRequest } from '../../database/entities/document-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentRequest])],
  controllers: [DocumentRequestsController],
  providers: [DocumentRequestsService],
  exports: [DocumentRequestsService],
})
export class DocumentRequestsModule {}
