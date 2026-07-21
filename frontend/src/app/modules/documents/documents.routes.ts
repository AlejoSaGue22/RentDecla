import { Routes } from '@angular/router';
import { DocumentsPageComponent } from './pages/documents/documents-page.component';
import { DocumentReviewComponent } from './pages/review/document-review.component';

export const documentsRoutes: Routes = [
  { path: '', component: DocumentsPageComponent },
  { path: 'review', component: DocumentReviewComponent },
];
