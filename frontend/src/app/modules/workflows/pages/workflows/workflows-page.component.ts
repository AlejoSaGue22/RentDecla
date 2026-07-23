import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkflowsService } from '../../../../core/services/workflows.service';
import { ClientsService } from '../../../../core/services/clients.service';
import { Workflow, WorkflowStatus, WorkflowType, Client } from '../../../../core/models';

@Component({
  selector: 'app-workflows-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="workflows-container animate-fade-in max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Flujos de Trabajo</h1>
          <p class="subtitle text-sm text-slate-500">Monitorea y gestiona las declaraciones de tus clientes</p>
        </div>
        <button
          mat-raised-button
          color="primary"
          *ngIf="!showCreateForm"
          (click)="openCreateForm()"
        >
          <mat-icon>add</mat-icon>
          Nuevo Workflow
        </button>
      </div>

      <!-- Formulario para iniciar nuevo proceso/workflow (Toggleable) -->
      <mat-card *ngIf="showCreateForm" class="p-6 mb-6 animate-scale-in">
        <h3 class="text-base font-bold text-slate-700 mb-4">Iniciar Nuevo Proceso</h3>
        <form (ngSubmit)="onCreateWorkflow()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Cliente</mat-label>
              <mat-select [(ngModel)]="newWorkflow.clientId" name="clientId" required>
                <mat-option *ngFor="let client of clients" [value]="client.id">
                  {{ client.firstName }} {{ client.lastName }} ({{ client.documentType || 'CC' }} {{ client.documentNumber }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Tipo de Declaración</mat-label>
              <mat-select [(ngModel)]="newWorkflow.type" name="type" required>
                <mat-option [value]="'declaracion_renta'">Declaración de Renta</mat-option>
                <mat-option [value]="'declaracion_simplificada'">Declaración Simplificada</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Año Fiscal</mat-label>
              <input matInput type="number" [(ngModel)]="newWorkflow.taxYear" name="taxYear" required min="2020" max="2030">
            </mat-form-field>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Notas adicionales</mat-label>
              <textarea matInput [(ngModel)]="newWorkflow.notes" name="notes" rows="3" placeholder="Agrega detalles o instrucciones sobre este flujo de trabajo..."></textarea>
            </mat-form-field>
          </div>

          <div class="flex justify-end gap-3">
            <button mat-stroked-button type="button" (click)="closeCreateForm()">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="savingWorkflow">
              <mat-spinner *ngIf="savingWorkflow" diameter="20" class="inline-block mr-2"></mat-spinner>
              Iniciar Proceso
            </button>
          </div>
        </form>
      </mat-card>

      <!-- Listado de Workflows -->
      <mat-card class="p-6">
        <div *ngIf="loadingWorkflows" class="flex justify-center items-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div *ngIf="!loadingWorkflows && workflows.length === 0" class="empty-state py-12 text-center text-slate-400 flex flex-col items-center justify-center">
          <mat-icon style="font-size: 48px; width: 48px; height: 48px; color: #94a3b8;">account_tree</mat-icon>
          <h3 class="text-lg font-semibold mt-4 text-slate-700">No hay procesos activos</h3>
          <p class="text-sm max-w-sm mt-1">Registra un nuevo proceso seleccionando un cliente para empezar a gestionar sus declaraciones.</p>
        </div>

        <div *ngIf="!loadingWorkflows && workflows.length > 0" class="overflow-x-auto">
          <table mat-table [dataSource]="workflows" class="w-full text-left border-collapse">
            <!-- Columna Cliente -->
            <ng-container matColumnDef="client">
              <th mat-header-cell *matHeaderCellDef class="py-3 px-4 font-semibold text-slate-600 text-sm">Cliente</th>
              <td mat-cell *matCellDef="let wf" class="py-4 px-4 font-medium text-slate-800">
                <div class="flex flex-col">
                  <span>{{ wf.client?.firstName }} {{ wf.client?.lastName }}</span>
                  <span class="text-xs text-slate-400 font-normal">
                    {{ wf.client?.documentType || 'CC' }} {{ wf.client?.documentNumber }}
                  </span>
                </div>
              </td>
            </ng-container>

            <!-- Columna Tipo -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef class="py-3 px-4 font-semibold text-slate-600 text-sm">Tipo</th>
              <td mat-cell *matCellDef="let wf" class="py-4 px-4 text-slate-700 text-sm">
                {{ getWorkflowTypeLabel(wf.type) }}
              </td>
            </ng-container>

            <!-- Columna Año Fiscal -->
            <ng-container matColumnDef="year">
              <th mat-header-cell *matHeaderCellDef class="py-3 px-4 font-semibold text-slate-600 text-sm">Año Fiscal</th>
              <td mat-cell *matCellDef="let wf" class="py-4 px-4 text-slate-700 text-sm font-semibold">
                {{ wf.taxYear }}
              </td>
            </ng-container>

            <!-- Columna Estado (Select editable en línea) -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="py-3 px-4 font-semibold text-slate-600 text-sm">Estado</th>
              <td mat-cell *matCellDef="let wf" class="py-4 px-4">
                <mat-form-field appearance="outline" class="status-field" style="width: 170px;">
                  <mat-select
                    [ngModel]="wf.status"
                    (ngModelChange)="onStatusChange(wf.id, $event)"
                    class="status-select"
                  >
                    <mat-option [value]="'not_started'">No Iniciado</mat-option>
                    <mat-option [value]="'in_progress'">En Progreso</mat-option>
                    <mat-option [value]="'awaiting_documents'">Esperando Docs</mat-option>
                    <mat-option [value]="'in_review'">En Revisión</mat-option>
                    <mat-option [value]="'completed'">Completado</mat-option>
                  </mat-select>
                </mat-form-field>
              </td>
            </ng-container>

            <!-- Columna Fechas -->
            <ng-container matColumnDef="dates">
              <th mat-header-cell *matHeaderCellDef class="py-3 px-4 font-semibold text-slate-600 text-sm">Fechas</th>
              <td mat-cell *matCellDef="let wf" class="py-4 px-4 text-xs text-slate-500">
                <div class="flex flex-col">
                  <span>Iniciado: {{ (wf.startedAt | date:'shortDate') || '—' }}</span>
                  <span>Finalizado: {{ (wf.completedAt | date:'shortDate') || '—' }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Columna Acciones -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="py-3 px-4"></th>
              <td mat-cell *matCellDef="let wf" class="py-4 px-4 text-right">
                <button
                  mat-icon-button
                  color="warn"
                  (click)="onDeleteWorkflow(wf.id)"
                  matTooltip="Cancelar proceso"
                >
                  <mat-icon>cancel</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="border-b border-slate-100"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="border-b border-slate-50 hover:bg-slate-50 transition-colors"></tr>
          </table>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    ::ng-deep .status-field .mat-mdc-text-field-wrapper {
      padding: 0 12px !important;
      height: 36px !important;
    }
    ::ng-deep .status-field .mat-mdc-form-field-flex {
      height: 36px !important;
      align-items: center !important;
    }
    ::ng-deep .status-field .mat-mdc-form-field-infix {
      padding: 6px 0 !important;
      min-height: auto !important;
    }
    ::ng-deep .status-field .mat-mdc-form-field-subscript-wrapper {
      display: none !important;
    }
  `],
})
export class WorkflowsPageComponent implements OnInit {
  workflows: Workflow[] = [];
  clients: Client[] = [];
  displayedColumns = ['client', 'type', 'year', 'status', 'dates', 'actions'];

  loadingWorkflows = false;
  showCreateForm = false;
  savingWorkflow = false;

  newWorkflow = {
    clientId: '',
    type: WorkflowType.DECLARACION_RENTA,
    taxYear: new Date().getFullYear() - 1,
    notes: '',
  };

  constructor(
    private workflowsService: WorkflowsService,
    private clientsService: ClientsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadWorkflows();
    this.loadClients();
  }

  loadWorkflows(): void {
    this.loadingWorkflows = true;
    this.workflowsService.findAll().subscribe({
      next: (data: Workflow[]) => {
        this.workflows = data;
        this.loadingWorkflows = false;
      },
      error: (err) => {
        console.error('Error loading workflows:', err);
        this.loadingWorkflows = false;
        this.snackBar.open('Error al cargar la lista de procesos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  loadClients(): void {
    this.clientsService.findAll().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
      },
      error: (err) => {
        console.error('Error loading clients list:', err);
      },
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
    this.newWorkflow = {
      clientId: '',
      type: WorkflowType.DECLARACION_RENTA,
      taxYear: new Date().getFullYear() - 1,
      notes: '',
    };
  }

  onCreateWorkflow(): void {
    if (!this.newWorkflow.clientId || !this.newWorkflow.type || !this.newWorkflow.taxYear) return;

    this.savingWorkflow = true;
    this.workflowsService.create(this.newWorkflow).subscribe({
      next: () => {
        this.savingWorkflow = false;
        this.closeCreateForm();
        this.snackBar.open('Flujo de trabajo iniciado correctamente', 'Cerrar', { duration: 3000 });
        this.loadWorkflows();
      },
      error: (err) => {
        console.error('Error starting workflow:', err);
        this.savingWorkflow = false;
        this.snackBar.open('Error al iniciar el flujo de trabajo', 'Cerrar', { duration: 3000 });
      },
    });
  }

  onStatusChange(id: string, newStatus: string): void {
    this.workflowsService.updateStatus(id, newStatus).subscribe({
      next: () => {
        this.snackBar.open('Estado del proceso actualizado', 'Cerrar', { duration: 3000 });
        this.loadWorkflows();
      },
      error: (err) => {
        console.error('Error updating workflow status:', err);
        this.snackBar.open('Error al actualizar el estado del proceso', 'Cerrar', { duration: 3000 });
      },
    });
  }

  onDeleteWorkflow(id: string): void {
    if (confirm('¿Estás seguro de que deseas cancelar este flujo de trabajo?')) {
      this.workflowsService.remove(id).subscribe({
        next: () => {
          this.snackBar.open('Flujo de trabajo cancelado', 'Cerrar', { duration: 3000 });
          this.loadWorkflows();
        },
        error: (err) => {
          console.error('Error cancelling workflow:', err);
          this.snackBar.open('Error al cancelar el proceso', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }

  getWorkflowTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      declaracion_renta: 'Declaración de Renta',
      declaracion_simplificada: 'Declaración Simplificada',
    };
    return labels[type] || type;
  }
}
