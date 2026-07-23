import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly ACCESS_KEY = 'rentdecla_access_token';
  private readonly REFRESH_KEY = 'rentdecla_refresh_token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.ACCESS_KEY);
    }
    return null;
  }

  setTokens(access: string, refresh: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.ACCESS_KEY, access);
      localStorage.setItem(this.REFRESH_KEY, refresh);
    }
  }

  clearTokens(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.ACCESS_KEY);
      localStorage.removeItem(this.REFRESH_KEY);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }
}
