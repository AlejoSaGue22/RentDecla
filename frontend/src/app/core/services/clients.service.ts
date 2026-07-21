import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  findAll(params?: { status?: ClientStatus; search?: string; assignedToId?: string }): Observable<Client[]> {
    const cleanedParams: any = {};
    if (params) {
      Object.keys(params).forEach(key => {
        const val = (params as any)[key];
        if (val !== undefined && val !== null && val !== '' && val !== 'undefined') {
          cleanedParams[key] = val;
        }
      });
    }
    return this.http.get<Client[]>(this.apiUrl, { params: cleanedParams });
  }

  findOne(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  findByDocument(documentNumber: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/document/${documentNumber}`);
  }

  create(data: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Client>): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
