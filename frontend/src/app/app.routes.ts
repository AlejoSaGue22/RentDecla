import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [LoginGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'portal',
    loadChildren: () => import('./portal/portal.module').then((m) => m.PortalModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'clients',
        loadChildren: () => import('./modules/clients/clients.module').then((m) => m.ClientsModule),
      },
      {
        path: 'documents',
        loadChildren: () => import('./modules/documents/documents.module').then((m) => m.DocumentsModule),
      },
      {
        path: 'workflows',
        loadChildren: () => import('./modules/workflows/workflows.module').then((m) => m.WorkflowsModule),
      },
      {
        path: 'billing',
        loadChildren: () => import('./modules/billing/billing.module').then((m) => m.BillingModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.module').then((m) => m.SettingsModule),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
