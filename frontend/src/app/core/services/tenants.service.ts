import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tenant } from '../models';

@Injectable({ providedIn: 'root' })
export class TenantsService {
  private apiUrl = `${environment.apiUrl}/tenants`;

  constructor(private http: HttpClient) {}

  getMe(): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.apiUrl}/me`);
  }

  updateMe(data: Partial<Tenant>): Observable<Tenant> {
    return this.http.patch<Tenant>(`${this.apiUrl}/me`, data);
  }
}
