import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login-page.component';
import { AcceptInvitationPageComponent } from './pages/accept-invitation/accept-invitation-page.component';

export const authRoutes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'accept-invitation', component: AcceptInvitationPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
