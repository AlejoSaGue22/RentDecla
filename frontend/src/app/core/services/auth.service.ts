import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => this.tokenService.setTokens(res.accessToken, res.refreshToken)),
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.tokenService.setTokens(res.accessToken, res.refreshToken)),
    );
  }

  logout(): void {
    this.tokenService.clearTokens();
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService['REFRESH_KEY'];
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken });
  }
}
