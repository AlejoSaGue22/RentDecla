import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClientsService } from '../../../../core/services/clients.service';

@Component({
  selector: 'app-client-new',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule,
  ],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <button mat-icon-button (click)="router.navigate(['/clients'])">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-bold">Nuevo Cliente</h1>
      </div>

      <mat-card>
        <form (ngSubmit)="onSubmit()" class="p-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Nombres</mat-label>
              <input matInput [(ngModel)]="form.firstName" name="firstName" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Apellidos</mat-label>
              <input matInput [(ngModel)]="form.lastName" name="lastName" required>
            </mat-form-field>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Tipo Documento</mat-label>
              <mat-select [(ngModel)]="form.documentType" name="documentType" required>
                <mat-option *ngFor="let type of documentTypes" [value]="type.value">
                  {{ type.label }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Número Documento</mat-label>
              <input matInput [(ngModel)]="form.documentNumber" name="documentNumber" required>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="form.email" name="email" required>
          </mat-form-field>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Teléfono</mat-label>
              <input matInput [(ngModel)]="form.phone" name="phone">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Ciudad</mat-label>
              <mat-select [(ngModel)]="form.city" name="city">
                <mat-option *ngFor="let city of cities" [value]="city">
                  {{ city }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Dirección</mat-label>
            <input matInput [(ngModel)]="form.address" name="address">
          </mat-form-field>

          <div class="flex justify-end gap-3">
            <button mat-stroked-button type="button" (click)="router.navigate(['/clients'])">Cancelar</button>
            <button mat-raised-button color="primary" type="submit">Guardar Cliente</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
})
export class ClientNewPageComponent {
  form = {
    firstName: '',
    lastName: '',
    documentType: 'CC',
    documentNumber: '',
    email: '',
    phone: '',
    city: '',
    address: '',
  };

  documentTypes = [
    { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
    { value: 'CE', label: 'Cédula de Extranjería (CE)' },
    { value: 'NIT', label: 'Número de Identificación Tributaria (NIT)' },
    { value: 'PAS', label: 'Pasaporte (PAS)' }
  ];

  cities = [
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
    'Bucaramanga',
    'Cúcuta',
    'Pereira',
    'Santa Marta',
    'Ibagué',
    'Pasto',
    'Manizales',
    'Neiva',
    'Villavicencio'
  ];

  constructor(
    public router: Router,
    private clientsService: ClientsService,
  ) { }

  onSubmit(): void {
    this.clientsService.create(this.form).subscribe({
      next: (client: any) => this.router.navigate(['/clients', client.id]),
    });
  }
}
