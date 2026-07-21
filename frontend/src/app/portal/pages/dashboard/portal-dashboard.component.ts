import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { PortalService, PortalProfile } from '../../services/portal.service';

@Component({
  selector: 'app-portal-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  template: `
    <div class="dashboard animate-fade-in" *ngIf="profile">
      <div class="welcome-section">
        <h1>Hola, {{ profile.firstName }}</h1>
        <p>Bienvenido a tu portal de declaración de renta</p>
      </div>

      <div class="status-card">
        <div class="status-header">
          <h2>Estado de tu declaración</h2>
          <span class="status-badge" [class]="'status-' + profile.status">
            {{ getStatusLabel(profile.status) }}
          </span>
        </div>
        
        <div class="progress-timeline">
          <div class="timeline-step" [class.completed]="isStepCompleted('pending_invitation')">
            <div class="step-icon">
              <mat-icon>mail</mat-icon>
            </div>
            <span class="step-label">Invitación</span>
          </div>
          
          <div class="timeline-connector" [class.completed]="isStepCompleted('pending_profile')"></div>
          
          <div class="timeline-step" [class.completed]="isStepCompleted('pending_profile')">
            <div class="step-icon">
              <mat-icon>description</mat-icon>
            </div>
            <span class="step-label">Perfil</span>
          </div>
          
          <div class="timeline-connector" [class.completed]="isStepCompleted('pending_documents')"></div>
          
          <div class="timeline-step" [class.completed]="isStepCompleted('pending_documents')">
            <div class="step-icon">
              <mat-icon>folder</mat-icon>
            </div>
            <span class="step-label">Documentos</span>
          </div>
          
          <div class="timeline-connector" [class.completed]="isStepCompleted('in_review')"></div>
          
          <div class="timeline-step" [class.completed]="isStepCompleted('in_review')">
            <div class="step-icon">
              <mat-icon>rate_review</mat-icon>
            </div>
            <span class="step-label">Revisión</span>
          </div>
          
          <div class="timeline-connector" [class.completed]="isStepCompleted('completed')"></div>
          
          <div class="timeline-step" [class.completed]="profile.status === 'completed'">
            <div class="step-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <span class="step-label">Completado</span>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <div class="stat-icon amber">
            <mat-icon>pending_actions</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-value">{{ profile.summary.pendingDocumentRequests }}</p>
            <p class="stat-label">Documentos pendientes</p>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon red">
            <mat-icon>error_outline</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-value">{{ profile.summary.rejectedDocuments }}</p>
            <p class="stat-label">Requieren corrección</p>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>account_tree</mat-icon>
          </div>
          <div class="stat-content">
            <p class="stat-value">{{ profile.summary.totalWorkflows }}</p>
            <p class="stat-label">Declaraciones activas</p>
          </div>
        </mat-card>
      </div>

      <div class="actions-section">
        <h3>Acciones rápidas</h3>
        <div class="actions-grid">
          <button mat-raised-button color="primary" routerLink="/portal/documents">
            <mat-icon>upload_file</mat-icon>
            Subir documentos
          </button>
          <button mat-stroked-button routerLink="/portal/profile">
            <mat-icon>edit</mat-icon>
            Completar perfil
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .welcome-section h1 {
      font-size: 32px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }

    .welcome-section p {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }

    .status-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .status-header h2 {
      font-size: 20px;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }

    .status-pending_invitation,
    .status-pending_profile,
    .status-pending_documents {
      background: #fef3c7;
      color: #92400e;
    }

    .status-in_review,
    .status-requires_correction {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-completed {
      background: #dcfce7;
      color: #166534;
    }

    .progress-timeline {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 0;
    }

    .timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .step-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      transition: all 0.3s;
    }

    .timeline-step.completed .step-icon {
      background: #2563eb;
      color: white;
    }

    .step-label {
      font-size: 13px;
      color: #64748b;
      text-align: center;
    }

    .timeline-step.completed .step-label {
      color: #2563eb;
      font-weight: 500;
    }

    .timeline-connector {
      flex: 1;
      height: 2px;
      background: #e2e8f0;
      margin: 0 8px;
      transition: all 0.3s;
    }

    .timeline-connector.completed {
      background: #2563eb;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .stat-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.amber {
      background: #fef3c7;
      color: #f59e0b;
    }

    .stat-icon.red {
      background: #fee2e2;
      color: #ef4444;
    }

    .stat-icon.blue {
      background: #dbeafe;
      color: #3b82f6;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px 0;
    }

    .stat-label {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .actions-section h3 {
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 16px 0;
    }

    .actions-grid {
      display: flex;
      gap: 12px;
    }

    .actions-grid button {
      flex: 1;
      height: 56px;
      font-size: 15px;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        flex-direction: column;
      }

      .progress-timeline {
        flex-wrap: wrap;
        gap: 16px;
      }

      .timeline-connector {
        display: none;
      }
    }
  `],
})
export class PortalDashboardComponent implements OnInit {
  profile: PortalProfile | null = null;

  constructor(private portalService: PortalService) {}

  ngOnInit() {
    this.portalService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending_invitation: 'Invitación pendiente',
      pending_profile: 'Perfil pendiente',
      pending_documents: 'Documentos pendientes',
      in_review: 'En revisión',
      requires_correction: 'Requiere corrección',
      completed: 'Completado',
    };
    return labels[status] || status;
  }

  isStepCompleted(step: string): boolean {
    if (!this.profile) return false;
    
    const statusOrder = [
      'pending_invitation',
      'pending_profile',
      'pending_documents',
      'in_review',
      'requires_correction',
      'completed',
    ];
    
    const currentIndex = statusOrder.indexOf(this.profile.status);
    const stepIndex = statusOrder.indexOf(step);
    
    return currentIndex > stepIndex;
  }
}
