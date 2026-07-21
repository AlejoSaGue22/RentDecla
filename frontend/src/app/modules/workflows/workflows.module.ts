import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { workflowsRoutes } from './workflows.routes';

@NgModule({
  imports: [RouterModule.forChild(workflowsRoutes)],
  exports: [RouterModule],
})
export class WorkflowsModule {}
