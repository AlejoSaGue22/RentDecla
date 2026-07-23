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

  create(user: Partial<User> & { password?: string }): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id: string, user: Partial<User> & { password?: string }): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
