import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Workflow, WorkflowStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class WorkflowsService {
  private apiUrl = `${environment.apiUrl}/workflows`;

  constructor(private http: HttpClient) {}

  findAll(params?: { status?: WorkflowStatus; clientId?: string; taxYear?: number }): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(this.apiUrl, { params: params as any });
  }

  findByClient(clientId: string): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(`${this.apiUrl}/client/${clientId}`);
  }

  findOne(id: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Workflow>): Observable<Workflow> {
    return this.http.post<Workflow>(this.apiUrl, data);
  }

  updateStatus(id: string, status: string): Observable<Workflow> {
    return this.http.patch<Workflow>(`${this.apiUrl}/${id}/status`, { status });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
