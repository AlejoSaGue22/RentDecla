import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PortalService, PortalNotification } from '../../services/portal.service';

@Component({
  selector: 'app-portal-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="notifications-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1>Notificaciones</h1>
          <p>Mantente al día con tu declaración</p>
        </div>
        <button mat-stroked-button color="primary" (click)="markAllAsRead()" *ngIf="hasUnread()" [disabled]="isMarkingAll">
          <mat-icon>done_all</mat-icon>
          Marcar todas como leídas
        </button>
      </div>

      <div *ngIf="notifications.length > 0" class="notifications-container">
        <div *ngIf="todayNotifications.length > 0" class="notification-group">
          <h3 class="group-title">Hoy</h3>
          <div class="notifications-list">
            <mat-card 
              *ngFor="let notification of todayNotifications" 
              class="notification-card"
              [class.unread]="!notification.readAt"
              (click)="markAsRead(notification)"
            >
              <div class="notification-content">
                <div class="notification-icon" [class]="getIconClass(notification.type)">
                  <mat-icon>{{ getIcon(notification.type) }}</mat-icon>
                </div>
                <div class="notification-body">
                  <h3>{{ notification.subject }}</h3>
                  <p>{{ notification.content }}</p>
                  <span class="notification-date">{{ notification.createdAt | date:'shortTime' }}</span>
                </div>
                <div class="notification-status" *ngIf="!notification.readAt">
                  <span class="unread-dot"></span>
                </div>
              </div>
            </mat-card>
          </div>
        </div>

        <div *ngIf="yesterdayNotifications.length > 0" class="notification-group">
          <h3 class="group-title">Ayer</h3>
          <div class="notifications-list">
            <mat-card 
              *ngFor="let notification of yesterdayNotifications" 
              class="notification-card"
              [class.unread]="!notification.readAt"
              (click)="markAsRead(notification)"
            >
              <div class="notification-content">
                <div class="notification-icon" [class]="getIconClass(notification.type)">
                  <mat-icon>{{ getIcon(notification.type) }}</mat-icon>
                </div>
                <div class="notification-body">
                  <h3>{{ notification.subject }}</h3>
                  <p>{{ notification.content }}</p>
                  <span class="notification-date">{{ notification.createdAt | date:'shortTime' }}</span>
                </div>
                <div class="notification-status" *ngIf="!notification.readAt">
                  <span class="unread-dot"></span>
                </div>
              </div>
            </mat-card>
          </div>
        </div>

        <div *ngIf="olderNotifications.length > 0" class="notification-group">
          <h3 class="group-title">Anteriores</h3>
          <div class="notifications-list">
            <mat-card 
              *ngFor="let notification of olderNotifications" 
              class="notification-card"
              [class.unread]="!notification.readAt"
              (click)="markAsRead(notification)"
            >
              <div class="notification-content">
                <div class="notification-icon" [class]="getIconClass(notification.type)">
                  <mat-icon>{{ getIcon(notification.type) }}</mat-icon>
                </div>
                <div class="notification-body">
                  <h3>{{ notification.subject }}</h3>
                  <p>{{ notification.content }}</p>
                  <span class="notification-date">{{ notification.createdAt | date:'medium' }}</span>
                </div>
                <div class="notification-status" *ngIf="!notification.readAt">
                  <span class="unread-dot"></span>
                </div>
              </div>
            </mat-card>
          </div>
        </div>
      </div>

      <div *ngIf="notifications.length === 0" class="empty-state">
        <mat-icon>notifications_none</mat-icon>
        <h3>No hay notificaciones</h3>
        <p>Aquí aparecerán las actualizaciones de tu declaración</p>
      </div>
    </div>
  `,
  styles: [`
    .notifications-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .page-header p {
      font-size: 15px;
      color: #64748b;
      margin: 0;
    }

    .notifications-container {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .notification-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .group-title {
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .notification-card {
      padding: 20px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .notification-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .notification-card.unread {
      border-left: 4px solid #2563eb;
      background: #f8fafc;
    }

    .notification-content {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .notification-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: #eff6ff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2563eb;
      flex-shrink: 0;
    }

    .notification-icon.success {
      background: #dcfce7;
      color: #16a34a;
    }

    .notification-icon.warning {
      background: #fef3c7;
      color: #f59e0b;
    }

    .notification-icon.error {
      background: #fee2e2;
      color: #dc2626;
    }

    .notification-body {
      flex: 1;
    }

    .notification-body h3 {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 4px 0;
    }

    .notification-body p {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 8px 0;
      line-height: 1.5;
    }

    .notification-date {
      font-size: 12px;
      color: #94a3b8;
    }

    .notification-status {
      flex-shrink: 0;
    }

    .unread-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2563eb;
      display: block;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 18px;
      font-weight: 600;
      color: #334155;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }
  `],
})
export class PortalNotificationsComponent implements OnInit {
  notifications: PortalNotification[] = [];
  todayNotifications: PortalNotification[] = [];
  yesterdayNotifications: PortalNotification[] = [];
  olderNotifications: PortalNotification[] = [];
  isMarkingAll = false;

  constructor(
    private portalService: PortalService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.portalService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.groupNotifications();
      },
    });
  }

  groupNotifications() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    this.todayNotifications = [];
    this.yesterdayNotifications = [];
    this.olderNotifications = [];

    this.notifications.forEach(notification => {
      const notificationDate = new Date(notification.createdAt);
      const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());

      if (notificationDay.getTime() === today.getTime()) {
        this.todayNotifications.push(notification);
      } else if (notificationDay.getTime() === yesterday.getTime()) {
        this.yesterdayNotifications.push(notification);
      } else {
        this.olderNotifications.push(notification);
      }
    });
  }

  hasUnread(): boolean {
    return this.notifications.some(n => !n.readAt);
  }

  markAsRead(notification: PortalNotification) {
    if (!notification.readAt) {
      this.portalService.markNotificationRead(notification.id).subscribe({
        next: () => {
          notification.readAt = new Date().toISOString();
        },
      });
    }
  }

  markAllAsRead() {
    this.isMarkingAll = true;
    this.portalService.markAllNotificationsRead().subscribe({
      next: (result) => {
        this.notifications.forEach(n => {
          n.readAt = new Date().toISOString();
        });
        this.isMarkingAll = false;
        this.snackBar.open(`${result.marked} notificaciones marcadas como leídas`, 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.isMarkingAll = false;
        this.snackBar.open('Error al marcar notificaciones', 'Cerrar', { duration: 3000 });
      },
    });
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      document_uploaded: 'upload_file',
      document_reviewed: 'rate_review',
      workflow_completed: 'check_circle',
      document_request: 'assignment',
      email: 'email',
      whatsapp: 'chat',
      in_app: 'notifications',
    };
    return icons[type] || 'notifications';
  }

  getIconClass(type: string): string {
    const classes: Record<string, string> = {
      document_uploaded: '',
      document_reviewed: 'success',
      workflow_completed: 'success',
      document_request: 'warning',
    };
    return classes[type] || '';
  }
}
