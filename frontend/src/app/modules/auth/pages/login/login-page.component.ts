import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-container">
      <div class="login-left">
        <div class="login-left-content animate-fade-in">
          <div class="brand">
            <div class="brand-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#2563EB"/>
                <path d="M14 16h20v4H14v-4zm0 6h20v4H14v-4zm0 6h14v4H14v-4z" fill="white"/>
              </svg>
            </div>
            <h1 class="brand-name">RentDecla</h1>
          </div>

          <div class="login-hero">
            <h2>Gestión profesional de declaraciones de renta</h2>
            <p>Automatiza el proceso tributario de tus clientes con una plataforma moderna y eficiente.</p>
          </div>

          <div class="features">
            <div class="feature-item">
              <div class="feature-icon">
                <span class="material-icons-round">people_outline</span>
              </div>
              <div>
                <h3>Gestión de Clientes</h3>
                <p>Centraliza la información de tus clientes</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <span class="material-icons-round">folder_open</span>
              </div>
              <div>
                <h3>Documentos</h3>
                <p>Solicita y gestiona archivos fácilmente</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <span class="material-icons-round">trending_up</span>
              </div>
              <div>
                <h3>Workflows</h3>
                <p>Seguimiento completo del proceso</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="login-right">
        <div class="login-form-container animate-slide-up">
          <div class="login-form-header">
            <h2>Bienvenido</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Correo electrónico</mat-label>
              <input
                matInput
                type="email"
                name="email"
                [(ngModel)]="email"
                required
                email
                placeholder="nombre@empresa.com"
              >
              <mat-icon matPrefix>mail_outline</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Contraseña</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                name="password"
                [(ngModel)]="password"
                required
                placeholder="••••••••"
              >
              <mat-icon matPrefix>lock_outline</mat-icon>
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hidePassword = !hidePassword"
                class="password-toggle"
              >
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              class="login-button"
              type="submit"
              [disabled]="loading"
            >
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Iniciar Sesión</span>
              <span *ngIf="loading">Ingresando...</span>
            </button>

            <div *ngIf="error" class="error-message">
              <span class="material-icons-round">error_outline</span>
              <span>{{ error }}</span>
            </div>
          </form>

          <div class="login-footer">
            <p>¿No tienes cuenta? <a routerLink="/auth/register">Contacta a tu administrador</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }

    .login-left {
      flex: 1;
      background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
      padding: 60px;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .login-left::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
      animation: rotate 30s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .login-left-content {
      position: relative;
      z-index: 1;
      max-width: 480px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 60px;
    }

    .brand-icon {
      animation: scaleIn 0.5s ease-out;
    }

    .brand-name {
      font-size: 28px;
      font-weight: 700;
      color: white;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .login-hero {
      margin-bottom: 48px;
    }

    .login-hero h2 {
      font-size: 36px;
      font-weight: 700;
      color: white;
      margin: 0 0 16px 0;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .login-hero p {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      line-height: 1.6;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      animation: slideUp 0.5s ease-out backwards;
    }

    .feature-item:nth-child(1) { animation-delay: 0.2s; }
    .feature-item:nth-child(2) { animation-delay: 0.3s; }
    .feature-item:nth-child(3) { animation-delay: 0.4s; }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .feature-icon .material-icons-round {
      color: white;
      font-size: 24px;
    }

    .feature-item h3 {
      font-size: 16px;
      font-weight: 600;
      color: white;
      margin: 0 0 4px 0;
    }

    .feature-item p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }

    .login-right {
      width: 520px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .login-form-container {
      width: 100%;
      max-width: 400px;
    }

    .login-form-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .login-form-header h2 {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }

    .login-form-header p {
      font-size: 15px;
      color: #64748b;
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .login-form mat-form-field {
      margin-bottom: 0;
    }

    .password-toggle {
      color: #94a3b8;
    }

    .login-button {
      height: 52px !important;
      font-size: 16px !important;
      margin-top: 8px;
      box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.4) !important;
    }

    .login-button mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 10px;
      color: #dc2626;
      font-size: 14px;
    }

    .error-message .material-icons-round {
      font-size: 20px;
    }

    .login-footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .login-footer p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .login-footer a {
      color: #2563eb;
      font-weight: 500;
      text-decoration: none;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 1024px) {
      .login-left {
        display: none;
      }

      .login-right {
        width: 100%;
        flex: 1;
      }
    }

    @media (max-width: 480px) {
      .login-right {
        padding: 24px;
      }

      .login-form-header h2 {
        font-size: 24px;
      }
    }
  `],
})
export class LoginPageComponent {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        if (response.user?.role === 'client') {
          this.router.navigate(['/portal']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Credenciales incorrectas. Verifica tu información.';
        this.loading = false;
      },
    });
  }
}