import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-accept-invitation',
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
    <div class="invitation-container">
      <div class="invitation-card animate-fade-in">
        <div class="brand">
          <div class="brand-icon">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="#2563EB"/>
              <path d="M14 16h20v4H14v-4zm0 6h20v4H14v-4zm0 6h14v4H14v-4z" fill="white"/>
            </svg>
          </div>
          <h1 class="brand-name">RentDecla</h1>
        </div>

        <div *ngIf="!token" class="error-state">
          <mat-icon class="error-icon">link_off</mat-icon>
          <h2>Enlace inválido</h2>
          <p>No se encontró un token de invitación válido.</p>
          <a routerLink="/auth/login" mat-stroked-button>Ir al login</a>
        </div>

        <div *ngIf="token && !success" class="form-section">
          <h2>Acepta tu invitación</h2>
          <p>Define una contraseña para acceder a tu portal de declaración de renta.</p>

          <div *ngIf="error" class="alert-error">
            <mat-icon>error_outline</mat-icon>
            <span>{{ error }}</span>
          </div>

          <form (ngSubmit)="onSubmit()" class="invitation-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" [(ngModel)]="password" name="password" minlength="6" required>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar contraseña</mat-label>
              <input matInput [type]="hideConfirm ? 'password' : 'text'" [(ngModel)]="confirmPassword" name="confirmPassword" minlength="6" required>
              <button mat-icon-button matSuffix type="button" (click)="hideConfirm = !hideConfirm">
                <mat-icon>{{ hideConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="loading || !isValid()">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">Aceptar invitación</span>
            </button>
          </form>
        </div>

        <div *ngIf="success" class="success-state">
          <mat-icon class="success-icon">check_circle</mat-icon>
          <h2>Invitación aceptada</h2>
          <p>Tu cuenta ha sido creada exitosamente. Serás redirigido al portal.</p>
        </div>

        <div class="footer-link">
          <a routerLink="/auth/login">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invitation-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f0f4ff 0%, #e8ecf8 100%);
      padding: 24px;
    }

    .invitation-card {
      background: white;
      border-radius: 20px;
      padding: 48px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      text-align: center;
    }

    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 32px;
    }

    .brand-name {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .form-section h2 {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .form-section p {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 24px 0;
    }

    .invitation-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .full-width {
      width: 100%;
    }

    .submit-btn {
      height: 48px;
      font-size: 15px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .alert-error {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fef2f2;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .error-state, .success-state {
      padding: 24px 0;
    }

    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #dc2626;
    }

    .success-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #16a34a;
    }

    .error-state h2, .success-state h2 {
      font-size: 20px;
      font-weight: 600;
      color: #0f172a;
      margin: 16px 0 8px 0;
    }

    .error-state p, .success-state p {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 24px 0;
    }

    .footer-link {
      margin-top: 24px;
      font-size: 14px;
    }

    .footer-link a {
      color: #2563eb;
      text-decoration: none;
    }

    .footer-link a:hover {
      text-decoration: underline;
    }
  `],
})
export class AcceptInvitationPageComponent implements OnInit {
  token: string | null = null;
  password = '';
  confirmPassword = '';
  hidePassword = true;
  hideConfirm = true;
  loading = false;
  success = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  isValid(): boolean {
    return this.password.length >= 6 && this.password === this.confirmPassword;
  }

  onSubmit() {
    if (!this.token || !this.isValid()) return;

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.acceptInvitation(this.token, this.password).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/portal/dashboard']), 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al aceptar la invitación';
      },
    });
  }
}
