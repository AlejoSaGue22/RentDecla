import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PortalService, PortalProfile } from '../../services/portal.service';

const COLOMBIAN_CITIES = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué',
  'Manizales', 'Pasto', 'Neiva', 'Armenia', 'Popayán',
  'Sincelejo', 'Valledupar', 'Montería', 'Tunja', 'Villavicencio',
];

@Component({
  selector: 'app-portal-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatAutocompleteModule,
  ],
  template: `
    <div class="loading-state" *ngIf="loading">
      <mat-spinner diameter="48"></mat-spinner>
      <p>Cargando...</p>
    </div>

    <div class="error-state" *ngIf="error && !loading">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <h2>Error al cargar</h2>
      <p>{{ error }}</p>
      <button mat-raised-button color="primary" (click)="loadProfile()">Reintentar</button>
    </div>

    <div class="profile-page animate-fade-in" *ngIf="profile && !loading">
      <div class="page-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal, perfil tributario y seguridad</p>
      </div>

      <mat-tab-group>
        <mat-tab label="Información Personal">
          <mat-card class="profile-card">
            <form (ngSubmit)="savePersonalInfo()" class="profile-form" #personalForm="ngForm">
              <div class="form-section">
                <h2>Datos de contacto</h2>
                <div class="input-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Correo electrónico</mat-label>
                    <input matInput [value]="profile.email" disabled>
                    <mat-icon matSuffix>email</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Teléfono</mat-label>
                    <input matInput [(ngModel)]="personalData.phone" name="phone" placeholder="+573001234567">
                    <mat-icon matSuffix>phone</mat-icon>
                  </mat-form-field>
                </div>
              </div>

              <div class="form-section">
                <h2>Ubicación</h2>
                <div class="input-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Ciudad</mat-label>
                    <input matInput [(ngModel)]="personalData.city" name="city" [matAutocomplete]="cityAuto" (ngModelChange)="filterCities()" placeholder="Selecciona tu ciudad">
                    <mat-icon matSuffix>location_city</mat-icon>
                    <mat-autocomplete #cityAuto="matAutocomplete">
                      <mat-option *ngFor="let city of filteredCities" [value]="city">
                        {{ city }}
                      </mat-option>
                    </mat-autocomplete>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Dirección</mat-label>
                    <input matInput [(ngModel)]="personalData.address" name="address" placeholder="Calle 123 #45-67">
                    <mat-icon matSuffix>home</mat-icon>
                  </mat-form-field>
                </div>
              </div>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="isSavingPersonal">
                  <mat-spinner *ngIf="isSavingPersonal" diameter="20" class="btn-spinner"></mat-spinner>
                  <mat-icon *ngIf="!isSavingPersonal">save</mat-icon>
                  {{ isSavingPersonal ? 'Guardando...' : 'Guardar información personal' }}
                </button>
              </div>
            </form>
          </mat-card>
        </mat-tab>

        <mat-tab label="Perfil Tributario">
          <mat-card class="profile-card">
            <form (ngSubmit)="saveTaxProfile()" class="profile-form">
              <div class="form-section">
                <h2>Información de ingresos</h2>
                <div class="checkbox-grid">
                  <mat-checkbox [(ngModel)]="taxData.hasIngresosLaborales" name="hasIngresosLaborales">
                    Ingresos laborales
                  </mat-checkbox>
                  <mat-checkbox [(ngModel)]="taxData.hasIngresosIndependientes" name="hasIngresosIndependientes">
                    Ingresos independientes
                  </mat-checkbox>
                  <mat-checkbox [(ngModel)]="taxData.hasRendimientosFinancieros" name="hasRendimientosFinancieros">
                    Rendimientos financieros
                  </mat-checkbox>
                  <mat-checkbox [(ngModel)]="taxData.hasInversiones" name="hasInversiones">
                    Inversiones
                  </mat-checkbox>
                </div>
              </div>

              <div class="form-section">
                <h2>Patrimonio y bienes</h2>
                <div class="checkbox-grid">
                  <mat-checkbox [(ngModel)]="taxData.hasPropiedades" name="hasPropiedades">
                    Propiedades
                  </mat-checkbox>
                  <mat-checkbox [(ngModel)]="taxData.hasVehiculos" name="hasVehiculos">
                    Vehículos
                  </mat-checkbox>
                </div>
              </div>

              <div class="form-section">
                <h2>Deducciones</h2>
                <div class="checkbox-grid">
                  <mat-checkbox [(ngModel)]="taxData.hasDependientes" name="hasDependientes">
                    Dependientes
                  </mat-checkbox>
                  <mat-checkbox [(ngModel)]="taxData.hasMedicinaPrepaga" name="hasMedicinaPrepaga">
                    Medicina prepagada
                  </mat-checkbox>
                  <mat-checkbox [(ngModel)]="taxData.hasCreditoHipotecario" name="hasCreditoHipotecario">
                    Crédito hipotecario
                  </mat-checkbox>
                  <mat-checkbox [(ngModel)]="taxData.hasAportesVoluntarios" name="hasAportesVoluntarios">
                    Aportes voluntarios
                  </mat-checkbox>
                </div>
              </div>

              <div class="form-section">
                <h2>Información financiera</h2>
                <div class="input-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Ingresos anuales</mat-label>
                    <input matInput type="number" [(ngModel)]="taxData.ingresosAnuales" name="ingresosAnuales">
                    <span matPrefix>$&nbsp;</span>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Patrimonio bruto</mat-label>
                    <input matInput type="number" [(ngModel)]="taxData.patrimonioBruto" name="patrimonioBruto">
                    <span matPrefix>$&nbsp;</span>
                  </mat-form-field>
                </div>
              </div>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="isSavingTax">
                  <mat-spinner *ngIf="isSavingTax" diameter="20" class="btn-spinner"></mat-spinner>
                  <mat-icon *ngIf="!isSavingTax">save</mat-icon>
                  {{ isSavingTax ? 'Guardando...' : 'Guardar perfil tributario' }}
                </button>
              </div>
            </form>
          </mat-card>
        </mat-tab>

        <mat-tab label="Seguridad">
          <mat-card class="profile-card">
            <form (ngSubmit)="changePassword()" class="profile-form" #passwordForm="ngForm">
              <div class="form-section">
                <h2>Cambiar contraseña</h2>
                <div class="input-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Contraseña actual</mat-label>
                    <input matInput type="password" [(ngModel)]="passwordData.currentPassword" name="currentPassword" required>
                    <mat-icon matSuffix>lock</mat-icon>
                  </mat-form-field>
                </div>

                <div class="input-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Nueva contraseña</mat-label>
                    <input matInput type="password" [(ngModel)]="passwordData.newPassword" name="newPassword" required minlength="6" #newPassword="ngModel">
                    <mat-icon matSuffix>lock_outline</mat-icon>
                    <mat-error *ngIf="newPassword.errors?.['minlength'] && newPassword.touched">
                      Mínimo 6 caracteres
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Confirmar nueva contraseña</mat-label>
                    <input matInput type="password" [(ngModel)]="passwordData.confirmPassword" name="confirmPassword" required #confirmPassword="ngModel">
                    <mat-icon matSuffix>lock_outline</mat-icon>
                    <mat-error *ngIf="passwordData.newPassword !== passwordData.confirmPassword && confirmPassword.touched">
                      Las contraseñas no coinciden
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit"
                        [disabled]="isChangingPassword || passwordForm.invalid || passwordData.newPassword !== passwordData.confirmPassword">
                  <mat-spinner *ngIf="isChangingPassword" diameter="20" class="btn-spinner"></mat-spinner>
                  <mat-icon *ngIf="!isChangingPassword">vpn_key</mat-icon>
                  {{ isChangingPassword ? 'Cambiando...' : 'Cambiar contraseña' }}
                </button>
              </div>
            </form>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 0;
      gap: 16px;
    }

    .loading-state p {
      color: #64748b;
      font-size: 15px;
      margin: 0;
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 0;
      gap: 8px;
      text-align: center;
    }

    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #dc2626;
    }

    .error-state h2 {
      font-size: 20px;
      font-weight: 600;
      color: #0f172a;
      margin: 8px 0 0 0;
    }

    .error-state p {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 16px 0;
      max-width: 400px;
    }

    .profile-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .page-header p {
      font-size: 15px;
      color: #64748b;
      margin: 0;
    }

    .profile-card {
      padding: 32px;
      margin-top: 24px;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .form-section h2 {
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 16px 0;
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .input-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .form-actions button {
      height: 48px;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-spinner {
      margin-right: 4px;
    }

    @media (max-width: 768px) {
      .checkbox-grid,
      .input-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class PortalProfileComponent implements OnInit {
  profile: PortalProfile | null = null;
  personalData: { phone?: string; address?: string; city?: string } = {};
  taxData: any = {};
  passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
  filteredCities = [...COLOMBIAN_CITIES];

  loading = true;
  error = '';
  isSavingPersonal = false;
  isSavingTax = false;
  isChangingPassword = false;

  constructor(
    private portalService: PortalService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.error = '';
    this.portalService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.personalData = {
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
        };
        this.taxData = profile.taxProfile || {};
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudo cargar tu perfil.';
        this.loading = false;
      },
    });
  }

  filterCities() {
    const value = (this.personalData.city || '').toLowerCase();
    this.filteredCities = COLOMBIAN_CITIES.filter((c) =>
      c.toLowerCase().includes(value),
    );
  }

  savePersonalInfo() {
    this.isSavingPersonal = true;
    this.portalService.updatePersonalInfo(this.personalData).subscribe({
      next: (updated) => {
        this.profile = { ...this.profile!, ...updated };
        this.isSavingPersonal = false;
        this.snackBar.open('Información personal guardada', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.isSavingPersonal = false;
        const msg = err.error?.message || 'Error al guardar información personal';
        this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
      },
    });
  }

  saveTaxProfile() {
    this.isSavingTax = true;
    this.portalService.updateProfile(this.taxData).subscribe({
      next: () => {
        this.isSavingTax = false;
        this.snackBar.open('Perfil tributario guardado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.isSavingTax = false;
        this.snackBar.open('Error al guardar perfil tributario', 'Cerrar', { duration: 3000 });
      },
    });
  }

  changePassword() {
    this.isChangingPassword = true;
    this.portalService.changePassword({
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword,
    }).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.snackBar.open('Contraseña cambiada exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.isChangingPassword = false;
        const msg = err.error?.message || 'Error al cambiar la contraseña';
        this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
      },
    });
  }
}
