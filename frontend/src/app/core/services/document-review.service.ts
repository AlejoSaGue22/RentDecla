import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DocumentReview {
  id: string;
  decision: 'approved' | 'rejected' | 'requires_correction';
  comment?: string;
  reviewedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentReviewService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getPendingDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews/pending`);
  }

  reviewDocument(documentId: string, decision: string, comment?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/documents/${documentId}/review`, {
      decision,
      comment,
    });
  }

  getDocumentReviews(documentId: string): Observable<DocumentReview[]> {
    return this.http.get<DocumentReview[]>(`${this.apiUrl}/documents/${documentId}/reviews`);
  }
}
