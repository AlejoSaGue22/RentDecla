import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PortalService, PortalProfile } from '../../services/portal.service';

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
    MatSnackBarModule,
  ],
  template: `
    <div class="profile-page animate-fade-in" *ngIf="profile">
      <div class="page-header">
        <h1>Perfil Tributario</h1>
        <p>Completa tu información para una declaración precisa</p>
      </div>

      <mat-card class="profile-card">
        <form (ngSubmit)="saveProfile()" class="profile-form">
          <div class="form-section">
            <h2>Información de ingresos</h2>
            <div class="checkbox-grid">
              <mat-checkbox [(ngModel)]="formData.hasIngresosLaborales" name="hasIngresosLaborales">
                Ingresos laborales
              </mat-checkbox>
              <mat-checkbox [(ngModel)]="formData.hasIngresosIndependientes" name="hasIngresosIndependientes">
                Ingresos independientes
              </mat-checkbox>
              <mat-checkbox [(ngModel)]="formData.hasRendimientosFinancieros" name="hasRendimientosFinancieros">
                Rendimientos financieros
              </mat-checkbox>
              <mat-checkbox [(ngModel)]="formData.hasInversiones" name="hasInversiones">
                Inversiones
              </mat-checkbox>
            </div>
          </div>

          <div class="form-section">
            <h2>Patrimonio y bienes</h2>
            <div class="checkbox-grid">
              <mat-checkbox [(ngModel)]="formData.hasPropiedades" name="hasPropiedades">
                Propiedades
              </mat-checkbox>
              <mat-checkbox [(ngModel)]="formData.hasVehiculos" name="hasVehiculos">
                Vehículos
              </mat-checkbox>
            </div>
          </div>

          <div class="form-section">
            <h2>Deducciones</h2>
            <div class="checkbox-grid">
              <mat-checkbox [(ngModel)]="formData.hasDependientes" name="hasDependientes">
                Dependientes
              </mat-checkbox>
              <mat-checkbox [(ngModel)]="formData.hasMedicinaPrepaga" name="hasMedicinaPrepaga">
                Medicina prepagada
              </mat-checkbox>
              <mat-checkbox [(ngModel)]="formData.hasCreditoHipotecario" name="hasCreditoHipotecario">
                Crédito hipotecario
              </mat-checkbox>
            </div>
          </div>

          <div class="form-section">
            <h2>Información financiera</h2>
            <div class="input-grid">
              <mat-form-field appearance="outline">
                <mat-label>Ingresos anuales</mat-label>
                <input matInput type="number" [(ngModel)]="formData.ingresosAnuales" name="ingresosAnuales">
                <span matPrefix>$&nbsp;</span>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Patrimonio bruto</mat-label>
                <input matInput type="number" [(ngModel)]="formData.patrimonioBruto" name="patrimonioBruto">
                <span matPrefix>$&nbsp;</span>
              </mat-form-field>
            </div>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit">
              <mat-icon>save</mat-icon>
              Guardar perfil
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
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
  formData: any = {};

  constructor(
    private portalService: PortalService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.portalService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.formData = profile.taxProfile || {};
      },
    });
  }

  saveProfile() {
    this.portalService.updateProfile(this.formData).subscribe({
      next: () => {
        this.snackBar.open('Perfil guardado exitosamente', 'Cerrar', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Error al guardar el perfil', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
