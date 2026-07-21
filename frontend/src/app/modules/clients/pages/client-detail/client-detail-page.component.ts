import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClientsService } from '../../../../core/services/clients.service';
import { DocumentsService } from '../../../../core/services/documents.service';
import { WorkflowsService } from '../../../../core/services/workflows.service';
import { Client, Document, Workflow, ClientStatus } from '../../../../core/models';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatChipsModule,     MatTabsModule, MatTableModule, MatTooltipModule,
  ],
  template: `
    <div *ngIf="client">
      <div class="flex items-center gap-4 mb-6">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-bold">{{ client.firstName }} {{ client.lastName }}</h1>
        <span [class]="statusClass(client.status)">{{ statusLabel(client.status) }}</span>
      </div>

      <mat-tab-group>
        <mat-tab label="Información">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              <p class="text-sm text-gray-500">Documento</p>
              <p class="font-medium">{{ client.documentType || 'CC' }} {{ client.documentNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium">{{ client.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Teléfono</p>
              <p class="font-medium">{{ client.phone || '—' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Ciudad</p>
              <p class="font-medium">{{ client.city || '—' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Dirección</p>
              <p class="font-medium">{{ client.address || '—' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Creado</p>
              <p class="font-medium">{{ client.createdAt | date:'medium' }}</p>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Documentos">
          <div class="p-4">
            <div *ngIf="documents.length === 0" class="text-center text-gray-500 py-8">
              No hay documentos subidos
            </div>
            <table mat-table [dataSource]="documents" *ngIf="documents.length > 0" class="w-full">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let doc">{{ doc.originalName }}</td>
              </ng-container>
              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Categoría</th>
                <td mat-cell *matCellDef="let doc">{{ doc.category || '—' }}</td>
              </ng-container>
              <ng-container matColumnDef="size">
                <th mat-header-cell *matHeaderCellDef>Tamaño</th>
                <td mat-cell *matCellDef="let doc">{{ (doc.fileSize / 1024).toFixed(0) }} KB</td>
              </ng-container>
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Subido</th>
                <td mat-cell *matCellDef="let doc">{{ doc.createdAt | date:'short' }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['name', 'category', 'size', 'date']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['name', 'category', 'size', 'date'];"></tr>
            </table>
          </div>
        </mat-tab>

        <mat-tab label="Workflows">
          <div class="p-4">
            <div *ngIf="workflows.length === 0" class="text-center text-gray-500 py-8">
              No hay workflows creados
            </div>
            <div *ngFor="let wf of workflows" class="border rounded p-4 mb-3">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ wf.type === 'declaracion_renta' ? 'Declaración de Renta' : wf.type }}</p>
                  <p class="text-sm text-gray-500">Año fiscal {{ wf.taxYear }}</p>
                </div>
                <span [class]="wf.status === 'completed' ? 'px-2 py-1 rounded text-xs bg-green-100 text-green-700' : 'px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700'">
                  {{ wf.status }}
                </span>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class ClientDetailPageComponent implements OnInit {
  client!: Client;
  documents: Document[] = [];
  workflows: Workflow[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private documentsService: DocumentsService,
    private workflowsService: WorkflowsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.clientsService.findOne(id).subscribe({
      next: (client: Client) => {
        this.client = client;
        this.loadDocuments();
        this.loadWorkflows();
      },
    });
  }

  loadDocuments(): void {
    this.documentsService.findByClient(this.client.id).subscribe({
      next: (docs: Document[]) => (this.documents = docs),
    });
  }

  loadWorkflows(): void {
    this.workflowsService.findByClient(this.client.id).subscribe({
      next: (wfs: Workflow[]) => (this.workflows = wfs),
    });
  }

  goBack(): void {
    this.router.navigate(['/clients']);
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

  statusClass(status: ClientStatus): string {
    return 'px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700';
  }
}
