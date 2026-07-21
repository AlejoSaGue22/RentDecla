import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    if (!this.tokenService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const token = this.tokenService.getAccessToken();
    if (token) {
      try {
        const payload = this.decodeToken(token);
        if (payload.role === 'client') {
          this.router.navigate(['/portal']);
          return false;
        }
      } catch (error) {
        // Si no se puede decodificar, permitir acceso
      }
    }

    return true;
  }

  private decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
