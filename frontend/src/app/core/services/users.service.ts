import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  findAll(params?: { role?: UserRole; search?: string }): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { params: params as any });
  }
}
