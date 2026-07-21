import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DocumentReviewService } from '../../../../core/services/document-review.service';
import { DocumentsService } from '../../../../core/services/documents.service';

interface PendingDocument {
  id: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  category?: string;
  status: string;
  createdAt: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

@Component({
  selector: 'app-document-review',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="review-container">
      <div class="review-header">
        <h1>Revisión de Documentos</h1>
        <p class="subtitle">Revisa y aprueba los documentos subidos por los clientes</p>
      </div>

      <div class="review-layout">
        <!-- Lista de documentos pendientes -->
        <div class="documents-list">
          <mat-card class="list-card">
            <div class="list-header">
              <h2>Documentos Pendientes</h2>
              <span class="badge">{{ pendingDocuments.length }}</span>
            </div>

            <div *ngIf="loading" class="loading-state">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando documentos...</p>
            </div>

            <div *ngIf="!loading && pendingDocuments.length === 0" class="empty-state">
              <mat-icon>check_circle_outline</mat-icon>
              <h3>No hay documentos pendientes</h3>
              <p>Todos los documentos han sido revisados</p>
            </div>

            <div *ngIf="!loading && pendingDocuments.length > 0" class="documents-items">
              <div
                *ngFor="let doc of pendingDocuments"
                class="document-item"
                [class.selected]="selectedDocument?.id === doc.id"
                (click)="selectDocument(doc)"
              >
                <div class="doc-icon">
                  <mat-icon>{{ getFileIcon(doc.mimeType) }}</mat-icon>
                </div>
                <div class="doc-info">
                  <h4>{{ doc.originalName }}</h4>
                  <p class="client-name" *ngIf="doc.client">
                    {{ doc.client.firstName }} {{ doc.client.lastName }}
                  </p>
                  <p class="doc-meta">
                    <span>{{ formatDate(doc.createdAt) }}</span>
                    <span>{{ formatFileSize(doc.fileSize) }}</span>
                  </p>
                </div>
                <mat-icon class="arrow-icon">chevron_right</mat-icon>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Panel de revisión -->
        <div class="review-panel">
          <mat-card *ngIf="!selectedDocument" class="no-selection-card">
            <div class="no-selection-content">
              <mat-icon>description</mat-icon>
              <h3>Selecciona un documento</h3>
              <p>Elige un documento de la lista para comenzar la revisión</p>
            </div>
          </mat-card>

          <mat-card *ngIf="selectedDocument" class="review-card">
            <div class="review-header-section">
              <div class="doc-details">
                <h2>{{ selectedDocument.originalName }}</h2>
                <div class="doc-meta-info">
                  <span class="meta-item" *ngIf="selectedDocument.client">
                    <mat-icon>person</mat-icon>
                    {{ selectedDocument.client.firstName }} {{ selectedDocument.client.lastName }}
                  </span>
                  <span class="meta-item">
                    <mat-icon>calendar_today</mat-icon>
                    {{ formatDate(selectedDocument.createdAt) }}
                  </span>
                  <span class="meta-item">
                    <mat-icon>folder</mat-icon>
                    {{ selectedDocument.category || 'Sin categoría' }}
                  </span>
                </div>
              </div>
              <button mat-icon-button (click)="downloadDocument()" class="download-btn">
                <mat-icon>download</mat-icon>
              </button>
            </div>

            <div class="review-actions">
              <h3>Decisión de Revisión</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Comentarios (opcional)</mat-label>
                <textarea
                  matInput
                  [(ngModel)]="reviewComment"
                  rows="4"
                  placeholder="Agrega comentarios sobre tu decisión..."
                ></textarea>
              </mat-form-field>

              <div class="action-buttons">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="approveDocument()"
                  [disabled]="submitting"
                  class="approve-btn"
                >
                  <mat-icon>check_circle</mat-icon>
                  Aprobar Documento
                </button>

                <button
                  mat-stroked-button
                  color="warn"
                  (click)="rejectDocument()"
                  [disabled]="submitting"
                  class="reject-btn"
                >
                  <mat-icon>cancel</mat-icon>
                  Rechazar Documento
                </button>
              </div>

              <div *ngIf="submitting" class="submitting-state">
                <mat-spinner diameter="24"></mat-spinner>
                <span>Procesando revisión...</span>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .review-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .review-header {
      margin-bottom: 32px;
    }

    .review-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }

    .review-layout {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 24px;
      align-items: start;
    }

    .list-card,
    .review-card,
    .no-selection-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .list-header h2 {
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }

    .badge {
      background: #2563eb;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
    }

    .loading-state,
    .empty-state {
      padding: 48px 24px;
      text-align: center;
    }

    .loading-state mat-spinner,
    .empty-state mat-icon {
      margin: 0 auto 16px;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #cbd5e1;
    }

    .loading-state p,
    .empty-state h3 {
      font-size: 16px;
      font-weight: 600;
      color: #334155;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .documents-items {
      max-height: 600px;
      overflow-y: auto;
    }

    .document-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .document-item:hover {
      background: #f8fafc;
    }

    .document-item.selected {
      background: #eff6ff;
      border-left: 3px solid #2563eb;
    }

    .doc-icon {
      width: 48px;
      height: 48px;
      background: #dbeafe;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .doc-icon mat-icon {
      color: #2563eb;
      font-size: 24px;
    }

    .doc-info {
      flex: 1;
      min-width: 0;
    }

    .doc-info h4 {
      font-size: 15px;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .client-name {
      font-size: 13px;
      color: #64748b;
      margin: 0 0 4px 0;
    }

    .doc-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
    }

    .arrow-icon {
      color: #cbd5e1;
    }

    .no-selection-card {
      padding: 80px 24px;
    }

    .no-selection-content {
      text-align: center;
    }

    .no-selection-content mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }

    .no-selection-content h3 {
      font-size: 20px;
      font-weight: 600;
      color: #334155;
      margin: 0 0 8px 0;
    }

    .no-selection-content p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .review-card {
      padding: 32px;
    }

    .review-header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .doc-details h2 {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 16px 0;
    }

    .doc-meta-info {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #64748b;
    }

    .meta-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .download-btn {
      color: #2563eb;
    }

    .review-actions h3 {
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 20px 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 24px;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
    }

    .approve-btn,
    .reject-btn {
      flex: 1;
      height: 48px;
      font-size: 15px;
      font-weight: 600;
    }

    .submitting-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
      padding: 12px;
      background: #f1f5f9;
      border-radius: 8px;
    }

    .submitting-state span {
      font-size: 14px;
      color: #64748b;
    }

    @media (max-width: 1024px) {
      .review-layout {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class DocumentReviewComponent implements OnInit {
  pendingDocuments: PendingDocument[] = [];
  selectedDocument: PendingDocument | null = null;
  reviewComment = '';
  loading = false;
  submitting = false;

  constructor(
    private documentReviewService: DocumentReviewService,
    private documentsService: DocumentsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadPendingDocuments();
  }

  loadPendingDocuments() {
    this.loading = true;
    this.documentReviewService.getPendingDocuments().subscribe({
      next: (docs) => {
        this.pendingDocuments = docs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading pending documents:', err);
        this.loading = false;
        this.snackBar.open('Error al cargar documentos pendientes', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  selectDocument(doc: PendingDocument) {
    this.selectedDocument = doc;
    this.reviewComment = '';
  }

  downloadDocument() {
    if (!this.selectedDocument) return;
    
    const downloadUrl = this.documentsService.getDownloadUrl(this.selectedDocument.id);
    window.open(downloadUrl, '_blank');
  }

  approveDocument() {
    if (!this.selectedDocument) return;

    this.submitting = true;
    this.documentReviewService.reviewDocument(
      this.selectedDocument.id,
      'approved',
      this.reviewComment
    ).subscribe({
      next: () => {
        this.snackBar.open('Documento aprobado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.removeSelectedFromList();
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error approving document:', err);
        this.snackBar.open('Error al aprobar documento', 'Cerrar', {
          duration: 3000,
        });
        this.submitting = false;
      },
    });
  }

  rejectDocument() {
    if (!this.selectedDocument) return;

    if (!this.reviewComment.trim()) {
      this.snackBar.open('Por favor agrega un comentario al rechazar', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.submitting = true;
    this.documentReviewService.reviewDocument(
      this.selectedDocument.id,
      'rejected',
      this.reviewComment
    ).subscribe({
      next: () => {
        this.snackBar.open('Documento rechazado', 'Cerrar', {
          duration: 3000,
        });
        this.removeSelectedFromList();
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error rejecting document:', err);
        this.snackBar.open('Error al rechazar documento', 'Cerrar', {
          duration: 3000,
        });
        this.submitting = false;
      },
    });
  }

  private removeSelectedFromList() {
    if (!this.selectedDocument) return;
    
    this.pendingDocuments = this.pendingDocuments.filter(
      doc => doc.id !== this.selectedDocument!.id
    );
    this.selectedDocument = null;
    this.reviewComment = '';
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'picture_as_pdf';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'description';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'table_chart';
    return 'insert_drive_file';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
