import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientsService } from '../../../../core/services/clients.service';
import { DocumentsService } from '../../../../core/services/documents.service';
import { Client, Document } from '../../../../core/models';

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="documents-container animate-fade-in">
      <div class="header-section mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Gestión de Documentos</h1>
        <p class="subtitle text-sm text-slate-500">Organiza, sube y administra los archivos de tus clientes</p>
      </div>

      <div class="documents-layout">
        <!-- Panel Izquierdo: Lista de Clientes -->
        <div class="clients-sidebar">
          <mat-card class="sidebar-card">
            <div class="sidebar-header p-4">
              <h2 class="text-base font-semibold text-slate-800">Clientes</h2>
            </div>
            
            <div class="px-4">
              <mat-form-field appearance="outline" class="search-field">
                <mat-icon matPrefix>search</mat-icon>
                <input
                  matInput
                  [(ngModel)]="clientSearch"
                  (input)="filterClients()"
                  placeholder="Buscar cliente..."
                >
              </mat-form-field>
            </div>

            <div *ngIf="loadingClients" class="spinner-container">
              <mat-spinner diameter="30"></mat-spinner>
            </div>

            <div *ngIf="!loadingClients && filteredClients.length === 0" class="empty-list">
              <p class="text-sm text-slate-400 text-center py-4">No se encontraron clientes</p>
            </div>

            <div *ngIf="!loadingClients && filteredClients.length > 0" class="clients-list p-2">
              <div
                *ngFor="let client of filteredClients"
                class="client-item"
                [class.selected]="selectedClient?.id === client.id"
                (click)="selectClient(client)"
              >
                <div class="client-avatar">
                  {{ getInitials(client) }}
                </div>
                <div class="client-info">
                  <span class="client-name">{{ client.firstName }} {{ client.lastName }}</span>
                  <span class="client-doc text-slate-400">{{ client.documentType || 'CC' }} {{ client.documentNumber }}</span>
                </div>
                <mat-icon class="chevron">chevron_right</mat-icon>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Panel Derecho: Documentos del Cliente Seleccionado -->
        <div class="documents-main">
          <!-- Si no hay cliente seleccionado -->
          <mat-card *ngIf="!selectedClient" class="no-selection-card">
            <div class="no-selection-content text-center py-20 text-slate-400 flex flex-col items-center justify-center">
              <mat-icon style="font-size: 56px; width: 56px; height: 56px; color: #94a3b8;">folder_open</mat-icon>
              <h3 class="text-lg font-semibold mt-4 text-slate-700">Ningún cliente seleccionado</h3>
              <p class="text-sm max-w-sm mt-2">Selecciona un cliente de la lista de la izquierda para ver, descargar o subir sus documentos.</p>
            </div>
          </mat-card>

          <!-- Si hay cliente seleccionado -->
          <div *ngIf="selectedClient" class="space-y-6">
            <!-- Info del Cliente y Subida de Archivo -->
            <mat-card class="p-6">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <div>
                  <h2 class="text-xl font-bold text-slate-800">
                    {{ selectedClient.firstName }} {{ selectedClient.lastName }}
                  </h2>
                  <p class="text-sm text-slate-500 mt-1">
                    {{ selectedClient.email }} | {{ selectedClient.documentType || 'CC' }} {{ selectedClient.documentNumber }}
                  </p>
                </div>
                <div>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {{ getClientStatusLabel(selectedClient.status) }}
                  </span>
                </div>
              </div>

              <mat-divider class="my-4"></mat-divider>

              <!-- Formulario de Subida -->
              <div class="upload-section mt-4">
                <h3 class="text-sm font-semibold text-slate-700 mb-3">Subir nuevo documento</h3>
                
                <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                  <mat-form-field appearance="outline" class="flex-1">
                    <mat-label>Categoría de Documento</mat-label>
                    <mat-select [(ngModel)]="uploadCategory">
                      <mat-option *ngFor="let cat of categories" [value]="cat">
                        {{ cat }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <div class="flex-1 flex flex-col justify-end">
                    <input
                      type="file"
                      #fileInput
                      style="display: none;"
                      (change)="onFileSelected($event)"
                    >
                    <button
                      mat-stroked-button
                      type="button"
                      class="file-select-btn"
                      (click)="fileInput.click()"
                    >
                      <mat-icon>attach_file</mat-icon>
                      <span class="truncate">{{ selectedFile ? selectedFile.name : 'Seleccionar Archivo' }}</span>
                    </button>
                  </div>

                  <button
                    mat-raised-button
                    color="primary"
                    [disabled]="!selectedFile || uploading"
                    (click)="uploadDocument()"
                    class="upload-submit-btn"
                  >
                    <mat-spinner *ngIf="uploading" diameter="20" class="inline-block mr-2"></mat-spinner>
                    <mat-icon *ngIf="!uploading">cloud_upload</mat-icon>
                    Subir
                  </button>
                </div>
              </div>
            </mat-card>

            <!-- Listado de Documentos Existentes -->
            <mat-card class="p-6">
              <h3 class="text-lg font-semibold text-slate-800 mb-4">Documentos del Cliente</h3>

              <div *ngIf="loadingDocuments" class="spinner-container py-12">
                <mat-spinner diameter="40"></mat-spinner>
              </div>

              <div *ngIf="!loadingDocuments && documents.length === 0" class="empty-docs py-12 text-center text-slate-400 flex flex-col items-center justify-center">
                <mat-icon style="font-size: 40px; width: 40px; height: 40px; color: #94a3b8;">description</mat-icon>
                <p class="mt-2 text-sm">No hay documentos subidos para este cliente.</p>
              </div>

              <div *ngIf="!loadingDocuments && documents.length > 0" class="overflow-x-auto">
                <table class="documents-table w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th class="py-3 px-4">Documento</th>
                      <th class="py-3 px-4">Categoría</th>
                      <th class="py-3 px-4">Tamaño</th>
                      <th class="py-3 px-4">Estado</th>
                      <th class="py-3 px-4">Subido</th>
                      <th class="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let doc of documents" class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td class="py-4 px-4 font-medium text-slate-800 truncate max-w-xs">{{ doc.originalName }}</td>
                      <td class="py-4 px-4">
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {{ doc.category || 'Sin categoría' }}
                        </span>
                      </td>
                      <td class="py-4 px-4 text-xs text-slate-500">
                        {{ (doc.fileSize / 1024).toFixed(0) }} KB
                      </td>
                      <td class="py-4 px-4">
                        <span [class]="getStatusClass(doc.status)">
                          {{ getStatusLabel(doc.status) }}
                        </span>
                      </td>
                      <td class="py-4 px-4 text-xs text-slate-500">
                        {{ doc.createdAt | date:'short' }}
                      </td>
                      <td class="py-4 px-4 text-right space-x-1">
                        <button
                          mat-icon-button
                          color="primary"
                          (click)="downloadDoc(doc)"
                          matTooltip="Descargar archivo"
                        >
                          <mat-icon>download</mat-icon>
                        </button>
                        <button
                          mat-icon-button
                          color="warn"
                          (click)="deleteDoc(doc)"
                          matTooltip="Eliminar"
                        >
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .documents-container {
      max-width: 1400px;
    }
    .documents-layout {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }
    .clients-sidebar {
      width: 320px;
      flex-shrink: 0;
    }
    .sidebar-card {
      padding: 8px 0;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }
    .search-field {
      width: 100%;
    }
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px 0;
    }
    .clients-list {
      overflow-y: auto;
      max-height: 55vh;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .client-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    .client-item:hover {
      background: #f8fafc;
    }
    .client-item.selected {
      background: #eff6ff;
      border-color: #bfdbfe;
    }
    .client-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .client-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .client-name {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .client-doc {
      font-size: 11px;
      margin-top: 1px;
    }
    .chevron {
      color: #cbd5e1;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .client-item.selected .chevron {
      color: #2563eb;
    }
    .documents-main {
      flex: 1;
      min-width: 0;
    }
    .no-selection-card {
      border: 2px dashed #e2e8f0;
      background: transparent;
      box-shadow: none !important;
      border-radius: 16px !important;
    }
    .file-select-btn {
      height: 56px !important;
      border-radius: 10px !important;
      font-weight: 500;
      width: 100%;
      border-color: #cbd5e1 !important;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 16px !important;
    }
    .file-select-btn mat-icon {
      margin-right: 8px;
      color: #64748b;
    }
    .upload-submit-btn {
      height: 56px !important;
      border-radius: 10px !important;
      padding: 0 24px !important;
      font-weight: 600;
    }
    
    @media (max-width: 900px) {
      .documents-layout {
        flex-direction: column;
      }
      .clients-sidebar {
        width: 100%;
      }
    }
  `],
})
export class DocumentsPageComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  clientSearch = '';
  loadingClients = false;

  selectedClient: Client | null = null;
  documents: Document[] = [];
  loadingDocuments = false;

  // File Upload State
  selectedFile: File | null = null;
  uploadCategory = 'Otro';
  uploading = false;

  categories = [
    'RUT',
    'Certificado Laboral',
    'Extracto Bancario',
    'Impuesto Predial',
    'Factura de Compra',
    'Certificado Tributario',
    'Otro',
  ];

  constructor(
    private clientsService: ClientsService,
    private documentsService: DocumentsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loadingClients = true;
    this.clientsService.findAll().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
        this.filteredClients = data;
        this.loadingClients = false;
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.loadingClients = false;
        this.snackBar.open('Error al cargar la lista de clientes', 'Cerrar', { duration: 3000 });
      },
    });
  }

  filterClients(): void {
    const search = this.clientSearch.trim().toLowerCase();
    if (!search) {
      this.filteredClients = this.clients;
      return;
    }
    this.filteredClients = this.clients.filter(
      (c) =>
        c.firstName.toLowerCase().includes(search) ||
        c.lastName.toLowerCase().includes(search) ||
        c.documentNumber.includes(search)
    );
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
    this.selectedFile = null;
    this.uploadCategory = 'Otro';
    this.loadDocuments(client.id);
  }

  loadDocuments(clientId: string): void {
    this.loadingDocuments = true;
    this.documentsService.findByClient(clientId).subscribe({
      next: (data: Document[]) => {
        this.documents = data;
        this.loadingDocuments = false;
      },
      error: (err) => {
        console.error('Error loading documents:', err);
        this.loadingDocuments = false;
        this.snackBar.open('Error al cargar los documentos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  getInitials(client: Client): string {
    return `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`.toUpperCase();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadDocument(): void {
    if (!this.selectedClient || !this.selectedFile) return;

    this.uploading = true;
    this.documentsService
      .upload(this.selectedFile, this.selectedClient.id, this.uploadCategory)
      .subscribe({
        next: (doc) => {
          this.uploading = false;
          this.selectedFile = null;
          this.snackBar.open('Documento subido correctamente', 'Cerrar', { duration: 3000 });
          this.loadDocuments(this.selectedClient!.id);
        },
        error: (err) => {
          console.error('Error uploading document:', err);
          this.uploading = false;
          this.snackBar.open('Error al subir el archivo', 'Cerrar', { duration: 3000 });
        },
      });
  }

  downloadDoc(doc: Document): void {
    const url = this.documentsService.downloadUrl(doc.id);
    window.open(url, '_blank');
  }

  deleteDoc(doc: Document): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el documento "${doc.originalName}"?`)) {
      this.documentsService.remove(doc.id).subscribe({
        next: () => {
          this.snackBar.open('Documento eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadDocuments(this.selectedClient!.id);
        },
        error: (err) => {
          console.error('Error deleting document:', err);
          this.snackBar.open('Error al eliminar el documento', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      uploaded: 'Subido',
      approved: 'Aprobado',
      rejected: 'Rechazado',
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800',
      uploaded: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800',
      approved: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800',
      rejected: 'px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800',
    };
    return classes[status] || 'px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800';
  }

  getClientStatusLabel(status: string): string {
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
