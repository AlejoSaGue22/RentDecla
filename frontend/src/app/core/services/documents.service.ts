import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Document } from '../models';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  upload(file: File, clientId: string, category?: string, description?: string, documentRequestId?: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
    if (category) formData.append('category', category);
    if (description) formData.append('description', description);
    if (documentRequestId) formData.append('documentRequestId', documentRequestId);
    return this.http.post<Document>(`${this.apiUrl}/upload`, formData);
  }

  findByClient(clientId: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/client/${clientId}`);
  }

  findOne(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  downloadUrl(id: string): string {
    return `${this.apiUrl}/${id}/download`;
  }

  getDownloadUrl(id: string): string {
    return this.downloadUrl(id);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
