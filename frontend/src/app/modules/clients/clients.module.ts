import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { clientsRoutes } from './clients.routes';

@NgModule({
  imports: [RouterModule.forChild(clientsRoutes)],
  exports: [RouterModule],
})
export class ClientsModule {}
