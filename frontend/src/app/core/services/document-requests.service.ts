import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DocumentRequest {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  priority: number;
  isRequired: boolean;
  clientId: string;
  client?: any;
  documents?: any[];
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentRequestsService {
  private apiUrl = `${environment.apiUrl}/document-requests`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<DocumentRequest[]> {
    return this.http.get<DocumentRequest[]>(this.apiUrl);
  }

  findByClient(clientId: string): Observable<DocumentRequest[]> {
    return this.http.get<DocumentRequest[]>(`${this.apiUrl}/client/${clientId}`);
  }

  findOne(id: string): Observable<DocumentRequest> {
    return this.http.get<DocumentRequest>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<DocumentRequest>): Observable<DocumentRequest> {
    return this.http.post<DocumentRequest>(this.apiUrl, data);
  }

  update(id: string, data: Partial<DocumentRequest>): Observable<DocumentRequest> {
    return this.http.patch<DocumentRequest>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
