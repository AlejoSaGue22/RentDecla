import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { PortalService, PortalDocument, PortalDocumentRequest } from '../../services/portal.service';

@Component({
  selector: 'app-portal-documents',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTabsModule, MatTableModule],
  template: `
    <div class="documents-page animate-fade-in">
      <div class="page-header">
        <h1>Mis Documentos</h1>
        <p>Gestiona y sube los documentos requeridos</p>
      </div>

      <mat-card class="upload-card">
        <div class="upload-zone" (click)="fileInput.click()" (drop)="onDrop($event)" (dragover)="onDragOver($event)">
          <input #fileInput type="file" (change)="onFileSelected($event)" multiple hidden>
          <mat-icon class="upload-icon">cloud_upload</mat-icon>
          <h3>Arrastra archivos aquí o haz clic para seleccionar</h3>
          <p>PDF, JPG, PNG hasta 10MB</p>
        </div>
      </mat-card>

      <mat-tab-group>
        <mat-tab label="Documentos subidos">
          <div class="tab-content">
            <table mat-table [dataSource]="documents" class="documents-table" *ngIf="documents.length > 0">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let doc">{{ doc.originalName }}</td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Categoría</th>
                <td mat-cell *matCellDef="let doc">{{ doc.category || 'Sin categoría' }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let doc">
                  <span class="status-badge" [class]="'status-' + doc.status">
                    {{ getStatusLabel(doc.status) }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let doc">{{ doc.createdAt | date:'short' }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="documents.length === 0" class="empty-state">
              <mat-icon>folder_open</mat-icon>
              <h3>No hay documentos</h3>
              <p>Sube tu primer documento para comenzar</p>
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Documentos requeridos">
          <div class="tab-content">
            <div class="requests-list" *ngIf="documentRequests.length > 0">
              <mat-card *ngFor="let request of documentRequests" class="request-card">
                <div class="request-header">
                  <div class="request-info">
                    <h3>{{ request.title }}</h3>
                    <p *ngIf="request.description">{{ request.description }}</p>
                  </div>
                  <span class="status-badge" [class]="'status-' + request.status">
                    {{ getRequestStatusLabel(request.status) }}
                  </span>
                </div>
                <div class="request-meta">
                  <span *ngIf="request.dueDate" class="meta-item">
                    <mat-icon>event</mat-icon>
                    Vence: {{ request.dueDate | date:'mediumDate' }}
                  </span>
                  <span class="meta-item">
                    <mat-icon>attach_file</mat-icon>
                    {{ request.documents.length }} documento(s) subido(s)
                  </span>
                </div>
              </mat-card>
            </div>

            <div *ngIf="documentRequests.length === 0" class="empty-state">
              <mat-icon>check_circle</mat-icon>
              <h3>Todo al día</h3>
              <p>No hay documentos pendientes de subir</p>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .documents-page {
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

    .upload-card {
      padding: 32px;
    }

    .upload-zone {
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 48px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .upload-zone:hover {
      border-color: #2563eb;
      background: #f8fafc;
    }

    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #94a3b8;
      margin-bottom: 16px;
    }

    .upload-zone h3 {
      font-size: 16px;
      font-weight: 600;
      color: #334155;
      margin: 0 0 8px 0;
    }

    .upload-zone p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .tab-content {
      padding: 24px 0;
    }

    .documents-table {
      width: 100%;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-uploaded {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-approved {
      background: #dcfce7;
      color: #166534;
    }

    .status-rejected,
    .status-requires_correction {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-completed {
      background: #dcfce7;
      color: #166534;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 18px;
      font-weight: 600;
      color: #334155;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .requests-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .request-card {
      padding: 20px;
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .request-info h3 {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 4px 0;
    }

    .request-info p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .request-meta {
      display: flex;
      gap: 16px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #64748b;
    }

    .meta-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `],
})
export class PortalDocumentsComponent implements OnInit {
  documents: PortalDocument[] = [];
  documentRequests: PortalDocumentRequest[] = [];
  displayedColumns = ['name', 'category', 'status', 'date'];

  constructor(private portalService: PortalService) {}

  ngOnInit() {
    this.loadDocuments();
    this.loadDocumentRequests();
  }

  loadDocuments() {
    this.portalService.getDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
      },
    });
  }

  loadDocumentRequests() {
    this.portalService.getDocumentRequests().subscribe({
      next: (requests) => {
        this.documentRequests = requests;
      },
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.uploadFiles(files);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.uploadFiles(files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  uploadFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.portalService.uploadDocument(files[i]).subscribe({
        next: () => {
          this.loadDocuments();
        },
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      uploaded: 'Subido',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      requires_correction: 'Requiere corrección',
    };
    return labels[status] || status;
  }

  getRequestStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      partially_uploaded: 'Parcial',
      completed: 'Completado',
    };
    return labels[status] || status;
  }
}
