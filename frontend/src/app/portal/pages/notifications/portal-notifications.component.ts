import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PortalService, PortalNotification } from '../../services/portal.service';

@Component({
  selector: 'app-portal-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="notifications-page animate-fade-in">
      <div class="page-header">
        <h1>Notificaciones</h1>
        <p>Mantente al día con tu declaración</p>
      </div>

      <div class="notifications-list" *ngIf="notifications.length > 0">
        <mat-card 
          *ngFor="let notification of notifications" 
          class="notification-card"
          [class.unread]="!notification.readAt"
          (click)="markAsRead(notification)"
        >
          <div class="notification-content">
            <div class="notification-icon">
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

  constructor(private portalService: PortalService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.portalService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
    });
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

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      email: 'email',
      whatsapp: 'chat',
      in_app: 'notifications',
    };
    return icons[type] || 'notifications';
  }
}
