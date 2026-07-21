import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { WorkflowsService } from '../../../../core/services/workflows.service';
import { Workflow, WorkflowStatus } from '../../../../core/models';

@Component({
  selector: 'app-workflows-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatSelectModule,
  ],
  template: `
    <div>
      <h1 class="text-2xl font-bold mb-6">Workflows</h1>
      <mat-card>
        <table mat-table [dataSource]="workflows" class="w-full">
          <ng-container matColumnDef="client">
            <th mat-header-cell *matHeaderCellDef>Cliente</th>
            <td mat-cell *matCellDef="let wf">{{ wf.client?.firstName }} {{ wf.client?.lastName }}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let wf">{{ wf.type }}</td>
          </ng-container>
          <ng-container matColumnDef="year">
            <th mat-header-cell *matHeaderCellDef>Año</th>
            <td mat-cell *matCellDef="let wf">{{ wf.taxYear }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let wf">
              <span [class]="statusClass(wf.status)">{{ wf.status }}</span>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <div *ngIf="workflows.length === 0" class="p-8 text-center text-gray-500">
          No hay workflows
        </div>
      </mat-card>
    </div>
  `,
})
export class WorkflowsPageComponent implements OnInit {
  workflows: Workflow[] = [];
  displayedColumns = ['client', 'type', 'year', 'status'];

  constructor(private workflowsService: WorkflowsService) {}

  ngOnInit(): void {
    this.workflowsService.findAll().subscribe({
      next: (data: Workflow[]) => (this.workflows = data),
    });
  }

  statusClass(status: WorkflowStatus): string {
    const classes: Record<string, string> = {
      not_started: 'px-2 py-1 rounded text-xs bg-gray-100 text-gray-700',
      in_progress: 'px-2 py-1 rounded text-xs bg-blue-100 text-blue-700',
      awaiting_documents: 'px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700',
      in_review: 'px-2 py-1 rounded text-xs bg-purple-100 text-purple-700',
      completed: 'px-2 py-1 rounded text-xs bg-green-100 text-green-700',
    };
    return classes[status] || '';
  }
}
