import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../../core/services/token.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.tokenService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const requiredRole = route.data['role'] as string;
    const token = this.tokenService.getAccessToken();
    
    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    try {
      const payload = this.decodeToken(token);
      const userRole = payload.role;

      if (requiredRole && userRole !== requiredRole) {
        if (userRole === 'client') {
          this.router.navigate(['/portal']);
        } else {
          this.router.navigate(['/dashboard']);
        }
        return false;
      }

      return true;
    } catch (error) {
      this.router.navigate(['/auth/login']);
      return false;
    }
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
