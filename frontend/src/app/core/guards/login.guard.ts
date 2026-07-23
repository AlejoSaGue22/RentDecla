import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.tokenService.isAuthenticated()) {
      const role = this.tokenService.getRole();
      if (role === 'client') {
        this.router.navigate(['/portal']);
      } else {
        this.router.navigate(['/dashboard']);
      }
      return false;
    }
    return true;
  }
}
