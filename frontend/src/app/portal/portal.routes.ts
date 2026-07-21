import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './layout/client-layout.component';
import { PortalDashboardComponent } from './pages/dashboard/portal-dashboard.component';
import { PortalDocumentsComponent } from './pages/documents/portal-documents.component';
import { PortalProfileComponent } from './pages/profile/portal-profile.component';
import { PortalNotificationsComponent } from './pages/notifications/portal-notifications.component';
import { RoleGuard } from '../core/guards/role.guard';

export const portalRoutes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    canActivate: [RoleGuard],
    data: { role: 'client' },
    children: [
      { path: 'dashboard', component: PortalDashboardComponent },
      { path: 'documents', component: PortalDocumentsComponent },
      { path: 'profile', component: PortalProfileComponent },
      { path: 'notifications', component: PortalNotificationsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
