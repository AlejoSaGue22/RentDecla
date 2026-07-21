import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ClientsService } from '../../../../core/services/clients.service';
import { Client, ClientStatus } from '../../../../core/models';
import { StatusBadgeComponent, EmptyStateComponent } from '../../../../shared/components';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    StatusBadgeComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="clients-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1>Clientes</h1>
          <p>Gestiona la información de tus clientes</p>
        </div>
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>person_add</mat-icon>
          Nuevo Cliente
        </button>
      </div>

      <mat-card class="clients-card">
        <div class="card-toolbar">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input
              matInput
              [(ngModel)]="search"
              (input)="loadClients()"
              placeholder="Buscar por nombre o documento..."
            >
          </mat-form-field>

          <div class="view-options">
            <button
              mat-icon-button
              [class.active]="viewMode === 'table'"
              (click)="viewMode = 'table'"
            >
              <mat-icon>view_list</mat-icon>
            </button>
            <button
              mat-icon-button
              [class.active]="viewMode === 'grid'"
              (click)="viewMode = 'grid'"
            >
              <mat-icon>grid_view</mat-icon>
            </button>
          </div>
        </div>

        <div *ngIf="clients.length === 0 && !loading" class="empty-container">
          <app-empty-state
            icon="people_outline"
            title="No hay clientes"
            message="Comienza agregando tu primer cliente para gestionar sus declaraciones de renta."
          >
            <button mat-raised-button color="primary" routerLink="new">
              <mat-icon>add</mat-icon>
              Agregar Cliente
            </button>
          </app-empty-state>
        </div>

        <div *ngIf="clients.length > 0" class="table-container">
          <table mat-table [dataSource]="clients" class="clients-table">
            <ng-container matColumnDef="client">
              <th mat-header-cell *matHeaderCellDef>Cliente</th>
              <td mat-cell *matCellDef="let client">
                <div class="client-info">
                  <div class="client-avatar">
                    {{ getInitials(client) }}
                  </div>
                  <div class="client-details">
                    <span class="client-name">{{ client.firstName }} {{ client.lastName }}</span>
                    <span class="client-email">{{ client.email }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="document">
              <th mat-header-cell *matHeaderCellDef>Documento</th>
              <td mat-cell *matCellDef="let client">
                <span class="document-number">
                  {{ client.documentType || 'CC' }} {{ client.documentNumber }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Teléfono</th>
              <td mat-cell *matCellDef="let client">
                <span class="phone">{{ client.phone || '—' }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let client">
                <app-status-badge
                  [status]="client.status"
                  [label]="statusLabel(client.status)"
                ></app-status-badge>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let client">
                <button
                  mat-icon-button
                  class="action-btn"
                  [routerLink]="[client.id]"
                  matTooltip="Ver cliente"
                >
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="client-row"></tr>
          </table>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .clients-page {
      max-width: 1400px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px 0;
      letter-spacing: -0.02em;
    }

    .page-header p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .clients-card {
      padding: 0;
      overflow: hidden;
    }

    .card-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .search-field {
      width: 320px;
    }

    .view-options {
      display: flex;
      gap: 4px;
      background: #f8fafc;
      border-radius: 8px;
      padding: 4px;
    }

    .view-options button {
      color: #94a3b8;
      transition: all 0.2s;
    }

    .view-options button.active {
      background: white;
      color: #2563eb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .empty-container {
      padding: 60px 24px;
    }

    .table-container {
      overflow-x: auto;
    }

    .clients-table {
      width: 100%;
    }

    .clients-table th.mat-mdc-header-cell {
      padding: 16px 24px;
    }

    .clients-table td.mat-mdc-cell {
      padding: 16px 24px;
    }

    .client-row {
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .client-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .client-avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 600;
    }

    .client-details {
      display: flex;
      flex-direction: column;
    }

    .client-name {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }

    .client-email {
      font-size: 13px;
      color: #64748b;
    }

    .document-number {
      font-size: 13px;
      font-family: 'SF Mono', 'Monaco', monospace;
      color: #334155;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .phone {
      font-size: 13px;
      color: #64748b;
    }

    .action-btn {
      color: #94a3b8;
      transition: color 0.2s;
    }

    .action-btn:hover {
      color: #2563eb;
    }

    @media (max-width: 900px) {
      .card-toolbar {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .search-field {
        width: 100%;
      }

      .view-options {
        align-self: flex-end;
      }
    }

    @media (max-width: 600px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
      }

      .page-header button {
        width: 100%;
      }
    }
  `],
})
export class ClientsListPageComponent implements OnInit {
  clients: Client[] = [];
  search = '';
  viewMode: 'table' | 'grid' = 'table';
  loading = false;
  displayedColumns = ['client', 'document', 'phone', 'status', 'actions'];

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientsService.findAll({ search: this.search || undefined }).subscribe({
      next: (data: Client[]) => {
        this.clients = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getInitials(client: Client): string {
    return `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`.toUpperCase();
  }

  statusLabel(status: ClientStatus): string {
    const labels: Record<string, string> = {
      pending_invitation: 'Invitación Pendiente',
      pending_profile: 'Perfil Pendiente',
      pending_documents: 'Documentos Pendientes',
      in_review: 'En Revisión',
      requires_correction: 'Requiere Corrección',
      completed: 'Completado',
      archived: 'Archivado',
    };
    return labels[status] || status;
  }
}