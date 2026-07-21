import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { documentsRoutes } from './documents.routes';

@NgModule({
  imports: [RouterModule.forChild(documentsRoutes)],
  exports: [RouterModule],
})
export class DocumentsModule {}
