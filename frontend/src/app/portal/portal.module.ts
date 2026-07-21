import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { portalRoutes } from './portal.routes';

@NgModule({
  imports: [RouterModule.forChild(portalRoutes)],
  exports: [RouterModule],
})
export class PortalModule {}
