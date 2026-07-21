import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { PortalService } from '../services/portal.service';
import { TokenService } from '../../core/services/token.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
  ],
  template: `
    <div class="portal-container">
      <header class="portal-header">
        <div class="header-content">
          <div class="header-left">
            <div class="logo">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="#2563EB"/>
                <path d="M14 16h20v4H14v-4zm0 6h20v4H14v-4zm0 6h14v4H14v-4z" fill="white"/>
              </svg>
              <span class="logo-text">Mi Portal</span>
            </div>
          </div>

          <nav class="header-nav">
            <a routerLink="/portal/dashboard" routerLinkActive="active" class="nav-link">
              <mat-icon>home</mat-icon>
              <span>Inicio</span>
            </a>
            <a routerLink="/portal/documents" routerLinkActive="active" class="nav-link">
              <mat-icon>folder</mat-icon>
              <span>Documentos</span>
            </a>
            <a routerLink="/portal/profile" routerLinkActive="active" class="nav-link">
              <mat-icon>person</mat-icon>
              <span>Perfil</span>
            </a>
          </nav>

          <div class="header-right">
            <button 
              mat-icon-button 
              routerLink="/portal/notifications" 
              routerLinkActive="active"
              class="notification-btn"
              [matBadge]="unreadCount > 0 ? unreadCount : null"
              matBadgeColor="warn"
              matBadgeSize="small"
            >
              <mat-icon>notifications</mat-icon>
            </button>
            
            <button mat-icon-button (click)="logout()" class="logout-btn">
              <mat-icon>logout</mat-icon>
            </button>
          </div>
        </div>
      </header>

      <main class="portal-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .portal-container {
      min-height: 100vh;
      background: #f8fafc;
    }

    .portal-header {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .header-nav {
      display: flex;
      gap: 8px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 8px;
      text-decoration: none;
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .nav-link:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .nav-link.active {
      background: #eff6ff;
      color: #2563eb;
    }

    .nav-link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notification-btn,
    .logout-btn {
      color: #64748b;
      transition: color 0.2s;
    }

    .notification-btn:hover,
    .logout-btn:hover {
      color: #334155;
    }

    .portal-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 0 16px;
      }

      .nav-link span {
        display: none;
      }

      .logo-text {
        font-size: 16px;
      }
    }
  `],
})
export class ClientLayoutComponent {
  unreadCount = 0;

  constructor(
    private portalService: PortalService,
    private tokenService: TokenService,
    private authService: AuthService,
  ) {
    this.loadNotifications();
  }

  loadNotifications() {
    this.portalService.getNotifications().subscribe({
      next: (notifications) => {
        this.unreadCount = notifications.filter(n => !n.readAt).length;
      },
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}
