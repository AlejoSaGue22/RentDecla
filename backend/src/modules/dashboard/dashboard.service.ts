import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, ClientStatus } from '../../database/entities/client.entity';
import { Workflow, WorkflowStatus } from '../../database/entities/workflow.entity';
import { Document, DocumentStatus } from '../../database/entities/document.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getStats(tenantId: string) {
    const totalClients = await this.clientRepository.count({ where: { tenantId } });
    const pendingClients = await this.clientRepository.count({
      where: { tenantId, status: ClientStatus.PENDING_DOCUMENTS },
    });
    const completedClients = await this.clientRepository.count({
      where: { tenantId, status: ClientStatus.COMPLETED },
    });
    const inReviewClients = await this.clientRepository.count({
      where: { tenantId, status: ClientStatus.IN_REVIEW },
    });

    const activeWorkflows = await this.workflowRepository.count({
      where: { tenantId, status: WorkflowStatus.IN_PROGRESS },
    });
    const completedWorkflows = await this.workflowRepository.count({
      where: { tenantId, status: WorkflowStatus.COMPLETED },
    });

    const pendingDocuments = await this.documentRepository.count({
      where: { status: DocumentStatus.PENDING },
    });

    const totalUsers = await this.userRepository.count({ where: { tenantId } });

    return {
      totalClients,
      pendingClients,
      completedClients,
      inReviewClients,
      activeWorkflows,
      completedWorkflows,
      pendingDocuments,
      totalUsers,
    };
  }

  async getRecentActivity(tenantId: string) {
    const recentClients = await this.clientRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' as const },
      take: 10,
      relations: { assignedTo: true },
    });

    return recentClients.map((client) => ({
      type: 'client_created',
      description: `${client.firstName} ${client.lastName} was registered`,
      date: client.createdAt,
      status: client.status,
    }));
  }
}
