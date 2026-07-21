import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { NotificationsService } from '../../core/services/notifications.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #sidenav
        mode="side"
        opened
        class="sidenav"
        [class.sidenav-collapsed]="collapsed"
      >
        <div class="sidenav-header">
          <div class="brand" *ngIf="!collapsed">
            <div class="brand-icon">
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="#2563EB"/>
                <path d="M14 16h20v4H14v-4zm0 6h20v4H14v-4zm0 6h14v4H14v-4z" fill="white"/>
              </svg>
            </div>
            <span class="brand-name">RentDecla</span>
          </div>
          <button
            mat-icon-button
            class="collapse-btn"
            (click)="collapsed = !collapsed"
          >
            <mat-icon>{{ collapsed ? 'chevron_right' : 'chevron_left' }}</mat-icon>
          </button>
        </div>

        <mat-nav-list class="nav-list">
          <a
            *ngFor="let item of navItems"
            mat-list-item
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
          >
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle *ngIf="!collapsed">{{ item.label }}</span>
          </a>
        </mat-nav-list>

        <div class="sidenav-footer">
          <mat-divider></mat-divider>
          <a
            mat-list-item
            routerLink="/settings"
            routerLinkActive="active"
            class="nav-item"
          >
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle *ngIf="!collapsed">Configuración</span>
          </a>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <header class="header">
          <div class="header-left">
            <button
              mat-icon-button
              (click)="sidenav.toggle()"
              class="menu-btn"
            >
              <mat-icon>menu</mat-icon>
            </button>
            <div class="breadcrumb">
              <span class="breadcrumb-item">RentDecla</span>
            </div>
          </div>

          <div class="header-right">
            <button 
              mat-icon-button 
              class="header-action" 
              matTooltip="Notificaciones"
              [matBadge]="unreadCount > 0 ? unreadCount : null"
              matBadgeColor="warn"
              matBadgeSize="small"
            >
              <mat-icon>notifications_none</mat-icon>
            </button>
            <button mat-icon-button class="header-action" [matMenuTriggerFor]="userMenu">
              <div class="avatar">AS</div>
            </button>
            <mat-menu #userMenu="matMenu" xPosition="before">
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Cerrar sesión</span>
              </button>
            </mat-menu>
          </div>
        </header>

        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: var(--sidebar-width);
      background: white;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
    }

    .sidenav-collapsed {
      width: 72px;
    }

    .sidenav-header {
      padding: 20px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-name {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .collapse-btn {
      color: #94a3b8;
      transition: color 0.2s;
    }

    .collapse-btn:hover {
      color: #475569;
    }

    .nav-list {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      border-radius: 12px !important;
      margin-bottom: 4px;
      height: 48px !important;
      color: #64748b;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      background: #f8fafc !important;
      color: #334155;
    }

    .nav-item.active {
      background: #eff6ff !important;
      color: #2563eb;
    }

    .nav-item.active mat-icon {
      color: #2563eb;
    }

    .nav-item mat-icon {
      color: #94a3b8;
      margin-right: 12px;
    }

    .sidenav-collapsed .nav-item {
      justify-content: center;
      padding: 0 12px;
    }

    .sidenav-collapsed .nav-item mat-icon {
      margin-right: 0;
    }

    .sidenav-footer {
      padding: 12px;
      margin-top: auto;
    }

    .sidenav-footer mat-divider {
      margin-bottom: 12px;
    }

    .main-content {
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .header {
      height: var(--header-height);
      background: white;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .menu-btn {
      color: #64748b;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #64748b;
    }

    .breadcrumb-item:first-child {
      color: #334155;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-action {
      color: #64748b;
      transition: color 0.2s;
    }

    .header-action:hover {
      color: #334155;
    }

    .avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 600;
    }

    .page-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
  `],
})
export class MainLayoutComponent implements OnInit {
  collapsed = false;
  unreadCount = 0;

  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'people_outline', label: 'Clientes', route: '/clients' },
    { icon: 'folder_open', label: 'Documentos', route: '/documents' },
    { icon: 'rate_review', label: 'Revisión', route: '/documents/review' },
    { icon: 'account_tree', label: 'Workflows', route: '/workflows' },
    { icon: 'payments_outlined', label: 'Facturación', route: '/billing' },
  ];

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.loadUnreadCount();
  }

  loadUnreadCount(): void {
    this.notificationsService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount = count;
      },
      error: (err) => {
        console.error('Error loading unread count:', err);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}