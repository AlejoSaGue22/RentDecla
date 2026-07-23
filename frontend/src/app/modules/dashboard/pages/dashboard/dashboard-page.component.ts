import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { DashboardStats } from '../../../../core/models';
import { StatCardComponent, StatusBadgeComponent } from '../../../../shared/components';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    StatCardComponent,
    StatusBadgeComponent,
  ],
  template: `
    <div class="dashboard animate-fade-in">
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen de actividad y métricas</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/clients/new">
          <mat-icon>person_add</mat-icon>
          Nuevo Cliente
        </button>
      </div>

      <div class="stats-grid">
        <app-stat-card
          icon="people"
          iconBg="#eff6ff"
          iconColor="#2563eb"
          label="Total Clientes"
          [value]="stats?.totalClients || 0"
          [animate]="true"
          class="stagger-1"
        ></app-stat-card>

        <app-stat-card
          icon="pending_actions"
          iconBg="#fef3c7"
          iconColor="#f59e0b"
          label="Pendientes"
          [value]="stats?.pendingClients || 0"
          [animate]="true"
          class="stagger-2"
        ></app-stat-card>

        <app-stat-card
          icon="check_circle"
          iconBg="#dcfce7"
          iconColor="#22c55e"
          label="Completados"
          [value]="stats?.completedClients || 0"
          [animate]="true"
          class="stagger-3"
        ></app-stat-card>

        <app-stat-card
          icon="rate_review"
          iconBg="#f3e8ff"
          iconColor="#a855f7"
          label="En Revisión"
          [value]="stats?.inReviewClients || 0"
          [animate]="true"
          class="stagger-4"
        ></app-stat-card>
      </div>

      <div class="dashboard-grid">
        <mat-card class="card workflows-card animate-slide-up">
          <div class="card-header">
            <h2>Estado de Workflows</h2>
            <a mat-button color="primary" routerLink="/workflows">Ver todos</a>
          </div>

          <div class="workflow-stats">
            <div class="workflow-stat">
              <div class="workflow-stat-info">
                <span class="workflow-stat-label">Activos</span>
                <span class="workflow-stat-value">{{ stats?.activeWorkflows || 0 }}</span>
              </div>
              <div class="workflow-stat-bar">
                <div
                  class="workflow-stat-fill active"
                  [style.width.%]="getWorkflowPercentage('active')"
                ></div>
              </div>
            </div>

            <div class="workflow-stat">
              <div class="workflow-stat-info">
                <span class="workflow-stat-label">Completados</span>
                <span class="workflow-stat-value">{{ stats?.completedWorkflows || 0 }}</span>
              </div>
              <div class="workflow-stat-bar">
                <div
                  class="workflow-stat-fill completed"
                  [style.width.%]="getWorkflowPercentage('completed')"
                ></div>
              </div>
            </div>
          </div>

          <div class="workflow-progress">
            <div class="progress-header">
              <span>Progreso total</span>
              <span class="progress-value">{{ workflowProgress | number:'1.0-0' }}%</span>
            </div>
            <mat-progress-bar
              mode="determinate"
              [value]="workflowProgress"
            ></mat-progress-bar>
          </div>
        </mat-card>

        <mat-card class="card documents-card animate-slide-up" style="animation-delay: 0.1s">
          <div class="card-header">
            <h2>Documentos</h2>
            <a mat-button color="primary" routerLink="/documents">Ver todos</a>
          </div>

          <div class="document-stats">
            <div class="document-stat">
              <div class="document-stat-icon pending">
                <mat-icon>hourglass_empty</mat-icon>
              </div>
              <div class="document-stat-content">
                <span class="document-stat-value">{{ stats?.pendingDocuments || 0 }}</span>
                <span class="document-stat-label">Pendientes por revisar</span>
              </div>
            </div>

            <div class="document-stat">
              <div class="document-stat-icon users">
                <mat-icon>group</mat-icon>
              </div>
              <div class="document-stat-content">
                <span class="document-stat-value">{{ stats?.totalUsers || 0 }}</span>
                <span class="document-stat-label">Usuarios activos</span>
              </div>
            </div>
          </div>

          <div class="quick-actions">
            <span class="quick-actions-label">Acciones rápidas</span>
            <div class="quick-actions-buttons">
              <button mat-stroked-button routerLink="/clients">
                <mat-icon>people</mat-icon>
                Ver Clientes
              </button>
              <button mat-stroked-button routerLink="/workflows">
                <mat-icon>account_tree</mat-icon>
                Workflows
              </button>
            </div>
          </div>
        </mat-card>
      </div>

      <mat-card class="card activity-card animate-slide-up" style="animation-delay: 0.2s">
        <div class="card-header">
          <h2>Actividad Reciente</h2>
        </div>
        <div class="activity-list">
          <div class="activity-item" *ngFor="let i of [1,2,3,4,5]">
            <div class="activity-icon">
              <mat-icon>person</mat-icon>
            </div>
            <div class="activity-content">
              <p class="activity-text">Nuevo cliente registrado</p>
              <span class="activity-time">Hace {{ i }} horas</span>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px 0;
      letter-spacing: -0.02em;
    }

    .page-header p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .card {
      padding: 24px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .card-header h2 {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }

    .workflows-card, .documents-card {
      min-height: 280px;
    }

    .workflow-stats {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 24px;
    }

    .workflow-stat-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .workflow-stat-label {
      font-size: 14px;
      color: #64748b;
    }

    .workflow-stat-value {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }

    .workflow-stat-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .workflow-stat-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.6s ease;
    }

    .workflow-stat-fill.active {
      background: #3b82f6;
    }

    .workflow-stat-fill.completed {
      background: #22c55e;
    }

    .workflow-progress {
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
      color: #64748b;
    }

    .progress-value {
      font-weight: 600;
      color: #0f172a;
    }

    .document-stats {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 24px;
    }

    .document-stat {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .document-stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .document-stat-icon.pending {
      background: #fef3c7;
      color: #f59e0b;
    }

    .document-stat-icon.users {
      background: #eff6ff;
      color: #2563eb;
    }

    .document-stat-icon mat-icon {
      font-size: 24px;
    }

    .document-stat-content {
      display: flex;
      flex-direction: column;
    }

    .document-stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1;
    }

    .document-stat-label {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }

    .quick-actions {
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .quick-actions-label {
      font-size: 13px;
      color: #94a3b8;
      display: block;
      margin-bottom: 12px;
    }

    .quick-actions-buttons {
      display: flex;
      gap: 12px;
    }

    .quick-actions-buttons button {
      flex: 1;
    }

    .activity-card {
      padding: 24px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      background: #f1f5f9;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      font-size: 14px;
      color: #334155;
      margin: 0 0 2px 0;
    }

    .activity-time {
      font-size: 12px;
      color: #94a3b8;
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 900px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
      }
    }
  `],
})
export class DashboardPageComponent implements OnInit {
  stats: DashboardStats | null = null;

  get workflowProgress(): number {
    const total = (this.stats?.activeWorkflows || 0) + (this.stats?.completedWorkflows || 0);
    if (total === 0) return 0;
    return ((this.stats?.completedWorkflows || 0) / total) * 100;
  }

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (stats: DashboardStats) => (this.stats = stats),
      error: () => console.error('Failed to load dashboard stats'),
    });
  }

  getWorkflowPercentage(type: 'active' | 'completed'): number {
    const total = (this.stats?.activeWorkflows || 0) + (this.stats?.completedWorkflows || 0);
    if (total === 0) return 0;
    const value = type === 'active' ? (this.stats?.activeWorkflows || 0) : (this.stats?.completedWorkflows || 0);
    return (value / total) * 100;
  }
}