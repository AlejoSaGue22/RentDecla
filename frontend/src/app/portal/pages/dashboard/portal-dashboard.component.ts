import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { PortalService, PortalProfile, PortalDocument, PortalDocumentRequest, PortalNotification } from '../../services/portal.service';

@Component({
  selector: 'app-portal-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, RouterLink],
  template: `
    <div class="loading-state" *ngIf="loading">
      <mat-spinner diameter="48"></mat-spinner>
      <p>Cargando...</p>
    </div>

    <div class="error-state" *ngIf="error && !loading">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <h2>Error al cargar</h2>
      <p>{{ error }}</p>
      <button mat-raised-button color="primary" (click)="loadProfile()">Reintentar</button>
    </div>

    <div class="dashboard animate-fade-in" *ngIf="profile && !loading">
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
          
          <div class="timeline-step" [class.completed]="isStepCompleted('in_review')" [class.warning]="profile.status === 'requires_correction'">
            <div class="step-icon">
              <mat-icon>rate_review</mat-icon>
            </div>
            <span class="step-label">Revisión</span>
          </div>
          
          <div class="timeline-connector" [class.completed]="profile.status === 'completed'"></div>
          
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

      <div class="content-grid">
        <div class="content-column">
          <mat-card class="content-card">
            <div class="card-header">
              <h3>Documentos recientes</h3>
              <button mat-button color="primary" routerLink="/portal/documents">Ver todos</button>
            </div>
            <div class="card-content">
              <div *ngIf="recentDocuments.length === 0" class="empty-state">
                <mat-icon>folder_open</mat-icon>
                <p>No hay documentos subidos</p>
              </div>
              <div *ngFor="let doc of recentDocuments" class="list-item">
                <div class="item-icon">
                  <mat-icon>{{ getDocumentIcon(doc.mimeType) }}</mat-icon>
                </div>
                <div class="item-content">
                  <p class="item-title">{{ doc.originalName }}</p>
                  <p class="item-subtitle">{{ doc.createdAt | date:'short' }}</p>
                </div>
                <span class="status-badge small" [class]="'status-' + doc.status">
                  {{ getDocumentStatusLabel(doc.status) }}
                </span>
              </div>
            </div>
          </mat-card>

          <mat-card class="content-card">
            <div class="card-header">
              <h3>Próximos vencimientos</h3>
            </div>
            <div class="card-content">
              <div *ngIf="upcomingDeadlines.length === 0" class="empty-state">
                <mat-icon>event_available</mat-icon>
                <p>No hay vencimientos próximos</p>
              </div>
              <div *ngFor="let deadline of upcomingDeadlines" class="list-item">
                <div class="item-icon warning">
                  <mat-icon>event</mat-icon>
                </div>
                <div class="item-content">
                  <p class="item-title">{{ deadline.title }}</p>
                  <p class="item-subtitle">Vence: {{ deadline.dueDate | date:'mediumDate' }}</p>
                </div>
                <span class="status-badge small" [class]="'status-' + deadline.status">
                  {{ getRequestStatusLabel(deadline.status) }}
                </span>
              </div>
            </div>
          </mat-card>
        </div>

        <div class="content-column">
          <mat-card class="content-card">
            <div class="card-header">
              <h3>Notificaciones recientes</h3>
              <button mat-button color="primary" routerLink="/portal/notifications">Ver todas</button>
            </div>
            <div class="card-content">
              <div *ngIf="recentNotifications.length === 0" class="empty-state">
                <mat-icon>notifications_none</mat-icon>
                <p>No hay notificaciones</p>
              </div>
              <div *ngFor="let notification of recentNotifications" class="list-item notification">
                <div class="item-icon info">
                  <mat-icon>{{ getNotificationIcon(notification.type) }}</mat-icon>
                </div>
                <div class="item-content">
                  <p class="item-title">{{ notification.subject }}</p>
                  <p class="item-subtitle">{{ notification.createdAt | date:'short' }}</p>
                </div>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-state,.error-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 0;gap:16px}
    .error-state{gap:8px;text-align:center}
    .error-icon{font-size:48px;width:48px;height:48px;color:#dc2626}
    .error-state h2{font-size:20px;font-weight:600;color:#0f172a;margin:8px 0 0}
    .error-state p{font-size:14px;color:#64748b;margin:0 0 16px;max-width:400px}
    .loading-state p{color:#64748b;font-size:15px;margin:0}
    .dashboard{display:flex;flex-direction:column;gap:32px}
    .welcome-section h1{font-size:32px;font-weight:700;color:#0f172a;margin:0 0 8px;letter-spacing:-.02em}
    .welcome-section p{font-size:16px;color:#64748b;margin:0}
    .status-card{background:#fff;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.1)}
    .status-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
    .status-header h2{font-size:20px;font-weight:600;color:#0f172a;margin:0}
    .status-badge{padding:6px 12px;border-radius:20px;font-size:13px;font-weight:500}
    .status-badge.small{padding:4px 8px;font-size:11px}
    .status-pending_invitation,.status-pending_profile,.status-pending_documents,.status-pending,.status-partially_uploaded{background:#fef3c7;color:#92400e}
    .status-in_review,.status-uploaded{background:#dbeafe;color:#1e40af}
    .status-requires_correction,.status-rejected{background:#fee2e2;color:#991b1b}
    .status-completed,.status-approved{background:#dcfce7;color:#166534}
    .progress-timeline{display:flex;align-items:center;justify-content:space-between;padding:24px 0}
    .timeline-step{display:flex;flex-direction:column;align-items:center;gap:12px;flex:1}
    .step-icon{width:56px;height:56px;border-radius:50%;background:#f1f5f9;display:flex;align-items:center;justify-content:center;color:#94a3b8;transition:all .3s}
    .timeline-step.completed .step-icon{background:#2563eb;color:#fff}
    .timeline-step.warning .step-icon{background:#f59e0b;color:#fff}
    .step-label{font-size:13px;color:#64748b;text-align:center}
    .timeline-step.completed .step-label{color:#2563eb;font-weight:500}
    .timeline-step.warning .step-label{color:#f59e0b;font-weight:500}
    .timeline-connector{flex:1;height:2px;background:#e2e8f0;margin:0 8px;transition:all .3s}
    .timeline-connector.completed{background:#2563eb}
    .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .stat-card{padding:24px;display:flex;align-items:center;gap:20px}
    .stat-icon{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center}
    .stat-icon.amber{background:#fef3c7;color:#f59e0b}
    .stat-icon.red{background:#fee2e2;color:#ef4444}
    .stat-icon.blue{background:#dbeafe;color:#3b82f6}
    .stat-content{flex:1}
    .stat-value{font-size:28px;font-weight:700;color:#0f172a;margin:0 0 4px}
    .stat-label{font-size:14px;color:#64748b;margin:0}
    .actions-section h3{font-size:18px;font-weight:600;color:#0f172a;margin:0 0 16px}
    .actions-grid{display:flex;gap:12px}
    .actions-grid button{flex:1;height:56px;font-size:15px}
    .content-grid{display:grid;grid-template-columns:2fr 1fr;gap:24px}
    .content-column{display:flex;flex-direction:column;gap:24px}
    .content-card{padding:24px}
    .card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
    .card-header h3{font-size:18px;font-weight:600;color:#0f172a;margin:0}
    .card-content{display:flex;flex-direction:column;gap:12px}
    .list-item{display:flex;align-items:center;gap:12px;padding:12px;border-radius:8px;transition:background .2s}
    .list-item:hover{background:#f8fafc}
    .item-icon{width:40px;height:40px;border-radius:8px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;color:#64748b;flex-shrink:0}
    .item-icon.warning{background:#fef3c7;color:#f59e0b}
    .item-icon.info{background:#dbeafe;color:#3b82f6}
    .item-content{flex:1;min-width:0}
    .item-title{font-size:14px;font-weight:500;color:#0f172a;margin:0 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .item-subtitle{font-size:12px;color:#64748b;margin:0}
    .empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;text-align:center}
    .empty-state mat-icon{font-size:48px;width:48px;height:48px;color:#cbd5e1;margin-bottom:12px}
    .empty-state p{font-size:14px;color:#64748b;margin:0}
    @media(max-width:768px){.stats-grid,.content-grid{grid-template-columns:1fr}.actions-grid{flex-direction:column}.progress-timeline{flex-wrap:wrap;gap:16px}.timeline-connector{display:none}}
  `],
})
export class PortalDashboardComponent implements OnInit {
  profile: PortalProfile | null = null;
  recentDocuments: PortalDocument[] = [];
  upcomingDeadlines: PortalDocumentRequest[] = [];
  recentNotifications: PortalNotification[] = [];
  loading = true;
  error = '';

  constructor(private portalService: PortalService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.error = '';
    this.portalService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.recentDocuments = profile.recentDocuments || [];
        this.upcomingDeadlines = profile.upcomingDeadlines || [];
        this.recentNotifications = profile.recentNotifications || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudo cargar tu perfil. Verifica que tengas una cuenta de cliente asociada.';
        this.loading = false;
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

  getDocumentStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      uploaded: 'Subido',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      requires_correction: 'Corrección',
    };
    return labels[status] || status;
  }

  getRequestStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      partially_uploaded: 'Parcial',
      completed: 'Completado',
    };
    return labels[status] || status;
  }

  getDocumentIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'picture_as_pdf';
    if (mimeType.includes('image')) return 'image';
    return 'description';
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      document_uploaded: 'upload_file',
      document_reviewed: 'rate_review',
      workflow_completed: 'check_circle',
      default: 'notifications',
    };
    return icons[type] || icons['default'];
  }

  isStepCompleted(step: string): boolean {
    if (!this.profile) return false;
    
    const statusOrder = [
      'pending_invitation',
      'pending_profile',
      'pending_documents',
      'in_review',
      'completed',
    ];
    
    const currentIndex = statusOrder.indexOf(this.profile.status);
    const stepIndex = statusOrder.indexOf(step);
    
    if (this.profile.status === 'requires_correction') {
      return stepIndex <= statusOrder.indexOf('in_review');
    }
    
    return currentIndex > stepIndex;
  }
}
