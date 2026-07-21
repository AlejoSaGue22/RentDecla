import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div>
      <h1 class="text-2xl font-bold mb-6">Facturación</h1>
      <mat-card class="p-8 text-center text-gray-500">
        Módulo de facturación próximamente
      </mat-card>
    </div>
  `,
})
export class BillingPageComponent {}
