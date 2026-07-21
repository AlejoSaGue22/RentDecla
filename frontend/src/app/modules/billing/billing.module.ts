import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { billingRoutes } from './billing.routes';

@NgModule({
  imports: [RouterModule.forChild(billingRoutes)],
  exports: [RouterModule],
})
export class BillingModule {}
