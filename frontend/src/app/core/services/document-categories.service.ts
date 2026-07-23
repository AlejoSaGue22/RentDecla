import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  tenantId?: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentCategoriesService {
  private apiUrl = `${environment.apiUrl}/document-categories`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<DocumentCategory[]> {
    return this.http.get<DocumentCategory[]>(this.apiUrl);
  }

  create(data: Partial<DocumentCategory>): Observable<DocumentCategory> {
    return this.http.post<DocumentCategory>(this.apiUrl, data);
  }
}
