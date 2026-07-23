import { Routes } from '@angular/router';
import { ClientsListPageComponent } from './pages/clients-list/clients-list-page.component';
import { ClientDetailPageComponent } from './pages/client-detail/client-detail-page.component';
import { ClientNewPageComponent } from './pages/client-new/client-new-page.component';
import { canDeactivateGuard } from '../../shared/guards/can-deactivate.guard';

export const clientsRoutes: Routes = [
  { path: '', component: ClientsListPageComponent },
  { path: 'new', component: ClientNewPageComponent },
  { path: ':id', component: ClientDetailPageComponent, canDeactivate: [canDeactivateGuard] },
];
