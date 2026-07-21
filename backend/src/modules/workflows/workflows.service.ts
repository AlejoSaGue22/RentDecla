import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow, WorkflowStatus } from '../../database/entities/workflow.entity';
import { CreateWorkflowDto, UpdateWorkflowDto, WorkflowQueryDto } from './dto/workflow.dto';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(dto: CreateWorkflowDto & { tenantId: string }) {
    const workflow = this.workflowRepository.create(dto);
    return this.workflowRepository.save(workflow);
  }

  async findAll(tenantId: string, query: WorkflowQueryDto) {
    const where: any = { tenantId };
    if (query.status) where.status = query.status;
    if (query.clientId) where.clientId = query.clientId;
    if (query.taxYear) where.taxYear = query.taxYear;
    return this.workflowRepository.find({
      where,
      relations: { client: true },
      order: { createdAt: 'DESC' as const },
    });
  }

  async findByClient(clientId: string) {
    return this.workflowRepository.find({
      where: { clientId },
      order: { taxYear: 'DESC' as const },
    });
  }

  async findOne(id: string) {
    const workflow = await this.workflowRepository.findOne({
      where: { id },
      relations: { client: { taxProfile: true } },
    });
    if (!workflow) throw new NotFoundException('Workflow not found');
    return workflow;
  }

  async updateStatus(id: string, status: string) {
    const workflow = await this.findOne(id);
    workflow.status = status as WorkflowStatus;
    if (status === WorkflowStatus.IN_PROGRESS && !workflow.startedAt) {
      workflow.startedAt = new Date();
    }
    if (status === WorkflowStatus.COMPLETED) {
      workflow.completedAt = new Date();
      
      if (workflow.client) {
        await this.notificationService.notifyWorkflowCompleted(
          workflow.client,
          workflow.taxYear,
        );
      }
    }
    return this.workflowRepository.save(workflow);
  }

  async update(id: string, dto: UpdateWorkflowDto) {
    const workflow = await this.findOne(id);
    Object.assign(workflow, dto);
    return this.workflowRepository.save(workflow);
  }

  async remove(id: string) {
    const workflow = await this.findOne(id);
    workflow.status = WorkflowStatus.CANCELLED;
    return this.workflowRepository.save(workflow);
  }
}
