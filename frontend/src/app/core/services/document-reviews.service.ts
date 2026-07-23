import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DocumentReview {
  id: string;
  decision: string;
  comment?: string;
  documentId: string;
  reviewedById: string;
  reviewedBy?: any;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentReviewsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  review(documentId: string, data: { decision: string; comment?: string }): Observable<DocumentReview> {
    return this.http.post<DocumentReview>(`${this.apiUrl}/documents/${documentId}/review`, data);
  }

  findByDocument(documentId: string): Observable<DocumentReview[]> {
    return this.http.get<DocumentReview[]>(`${this.apiUrl}/documents/${documentId}/reviews`);
  }

  findPending(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews/pending`);
  }
}
