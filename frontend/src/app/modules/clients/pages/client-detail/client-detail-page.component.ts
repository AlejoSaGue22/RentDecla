import { Component, OnInit, ViewChild, HostListener, ElementRef, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientsService } from '../../../../core/services/clients.service';
import { UsersService } from '../../../../core/services/users.service';
import { DocumentsService } from '../../../../core/services/documents.service';
import { WorkflowsService } from '../../../../core/services/workflows.service';
import { Client, Document, Workflow, ClientStatus, User, UserRole } from '../../../../core/models';

const COLOMBIAN_CITIES = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué',
  'Manizales', 'Pasto', 'Neiva', 'Armenia', 'Popayán',
  'Sincelejo', 'Valledupar', 'Montería', 'Tunja', 'Villavicencio',
];

const STATUS_COLORS: Record<string, string> = {
  pending_invitation: 'bg-blue-100 text-blue-700',
  pending_profile: 'bg-yellow-100 text-yellow-700',
  pending_documents: 'bg-orange-100 text-orange-700',
  in_review: 'bg-purple-100 text-purple-700',
  requires_correction: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-500',
};

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatAutocompleteModule,
    MatButtonModule, MatIconModule,
    MatChipsModule, MatTabsModule, MatTableModule, MatTooltipModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule,
  ],
  template: `
    <div *ngIf="isLoading" class="flex justify-center items-center py-20">
      <mat-spinner diameter="40"></mat-spinner>
    </div>

    <div *ngIf="!isLoading && client" class="animate-fade-in">
      <div class="detail-header">
        <button mat-icon-button (click)="goBack()" aria-label="Volver a lista de clientes">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-2xl font-bold">{{ client.firstName }} {{ client.lastName }}</h1>
        <span [class]="statusClass(client.status)">{{ statusLabel(client.status) }}</span>

        <span class="flex-1"></span>

        <div class="header-actions" *ngIf="!isEditing">
          <button
            *ngIf="client.status === ClientStatus.PENDING_INVITATION"
            mat-stroked-button
            color="accent"
            (click)="openResendDialog()"
            aria-label="Reenviar invitación"
          >
            <mat-icon>mail</mat-icon>
            Reenviar Invitación
          </button>
          <button mat-stroked-button color="primary" (click)="startEdit()" aria-label="Editar cliente">
            <mat-icon>edit</mat-icon>
            Editar
          </button>
        </div>
        <div class="header-actions" *ngIf="isEditing">
          <button
            mat-stroked-button
            (click)="cancelEdit()"
            [disabled]="isSaving"
            class="flex items-center gap-1"
            aria-label="Cancelar edición"
          >
            <mat-icon *ngIf="hasChanges" matTooltip="Hay cambios sin guardar" class="text-orange-500" style="font-size: 14px; width: 14px; height: 14px;" aria-hidden="true">circle</mat-icon>
            Cancelar
          </button>
          <button
            mat-raised-button
            color="primary"
            (click)="saveClient()"
            [disabled]="isSaving || !editForm?.form?.valid"
            aria-label="Guardar cambios"
          >
            <mat-icon *ngIf="isSaving">hourglass_top</mat-icon>
            <mat-icon *ngIf="!isSaving">save</mat-icon>
            {{ isSaving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>

      <mat-tab-group>
        <mat-tab label="Información">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4" *ngIf="!isEditing">
            <div>
              <p class="text-sm text-gray-500">Documento</p>
              <p class="font-medium">{{ client.documentType || 'CC' }} {{ client.documentNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Nombres</p>
              <p class="font-medium">{{ client.firstName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Apellidos</p>
              <p class="font-medium">{{ client.lastName }}</p>
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
              <p class="text-sm text-gray-500">Contador asignado</p>
              <p class="font-medium">{{ client.assignedTo?.name || '—' }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-500">Notas</p>
              <p class="font-medium whitespace-pre-wrap">{{ client.notes || '—' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Creado</p>
              <p class="font-medium">{{ client.createdAt | date:'medium' }}</p>
            </div>
          </div>

          <form #editForm="ngForm" *ngIf="isEditing" class="animate-fade-in">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <p class="text-sm text-gray-500">Documento</p>
                <p class="font-medium">{{ client.documentType || 'CC' }} {{ client.documentNumber }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Nombres *</p>
                <mat-form-field appearance="outline" class="w-full">
                  <input matInput #firstInput #firstName="ngModel" [(ngModel)]="editData.firstName" name="firstName" required minlength="2" aria-label="Nombres del cliente">
                  <mat-error *ngIf="firstName.errors?.['required'] && firstName.touched">El nombre es requerido</mat-error>
                  <mat-error *ngIf="firstName.errors?.['minlength'] && firstName.touched">Mínimo 2 caracteres</mat-error>
                </mat-form-field>
              </div>

              <div>
                <p class="text-sm text-gray-500">Apellidos *</p>
                <mat-form-field appearance="outline" class="w-full">
                  <input matInput #lastName="ngModel" [(ngModel)]="editData.lastName" name="lastName" required minlength="2" aria-label="Apellidos del cliente">
                  <mat-error *ngIf="lastName.errors?.['required'] && lastName.touched">El apellido es requerido</mat-error>
                  <mat-error *ngIf="lastName.errors?.['minlength'] && lastName.touched">Mínimo 2 caracteres</mat-error>
                </mat-form-field>
              </div>

              <div>
                <p class="text-sm text-gray-500">Email *</p>
                <mat-form-field appearance="outline" class="w-full">
                  <input matInput type="email" #email="ngModel" [(ngModel)]="editData.email" name="email" required email aria-label="Email del cliente">
                  <mat-error *ngIf="email.errors?.['required'] && email.touched">El email es requerido</mat-error>
                  <mat-error *ngIf="email.errors?.['email'] && email.touched">Formato de email inválido</mat-error>
                </mat-form-field>
              </div>

              <div>
                <p class="text-sm text-gray-500">Teléfono</p>
                <mat-form-field appearance="outline" class="w-full">
                  <input matInput [(ngModel)]="editData.phone" name="phone" aria-label="Teléfono del cliente">
                </mat-form-field>
              </div>

              <div>
                <p class="text-sm text-gray-500">Ciudad</p>
                <mat-form-field appearance="outline" class="w-full">
                  <input matInput [matAutocomplete]="auto" [(ngModel)]="editData.city" name="city" (ngModelChange)="updateCityFilter()" aria-label="Ciudad del cliente">
                  <mat-autocomplete #auto="matAutocomplete">
                    <mat-option *ngFor="let city of filteredCities" [value]="city">
                      {{ city }}
                    </mat-option>
                  </mat-autocomplete>
                </mat-form-field>
              </div>

              <div>
                <p class="text-sm text-gray-500">Dirección</p>
                <mat-form-field appearance="outline" class="w-full">
                  <input matInput [(ngModel)]="editData.address" name="address" aria-label="Dirección del cliente">
                </mat-form-field>
              </div>

              <div>
                <p class="text-sm text-gray-500">Contador asignado</p>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-select [(ngModel)]="editData.assignedToId" name="assignedToId" aria-label="Contador asignado">
                    <mat-option [value]="null">Sin asignar</mat-option>
                    <mat-option *ngFor="let acc of accountants" [value]="acc.id">
                      {{ acc.name }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div>
                <p class="text-sm text-gray-500">Estado</p>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-select #status="ngModel" [(ngModel)]="editData.status" name="status" required aria-label="Estado del cliente">
                    <mat-option *ngFor="let s of statuses" [value]="s.value">
                      <span [class]="'inline-block w-2 h-2 rounded-full mr-2 ' + statusDotClass(s.value)"></span>
                      {{ s.label }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="status.errors?.['required'] && status.touched">El estado es requerido</mat-error>
                </mat-form-field>
              </div>

              <div class="md:col-span-2">
                <p class="text-sm text-gray-500">Notas</p>
                <mat-form-field appearance="outline" class="w-full">
                  <textarea matInput [(ngModel)]="editData.notes" name="notes" rows="3" maxlength="500" aria-label="Notas del cliente"></textarea>
                  <mat-hint align="end">{{ (editData.notes || '').length }} / 500</mat-hint>
                </mat-form-field>
              </div>

              <div>
                <p class="text-sm text-gray-500">Creado</p>
                <p class="font-medium">{{ client.createdAt | date:'medium' }}</p>
              </div>
            </div>
          </form>
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

    <ng-template #resendDialogTemplate>
      <h2 mat-dialog-title>Reenviar Invitación</h2>
      <mat-dialog-content>
        <p class="mb-3">¿Estás seguro de reenviar la invitación a este cliente?</p>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Correo electrónico</mat-label>
          <input matInput type="email" [(ngModel)]="resendEmail">
        </mat-form-field>
        <p class="text-sm text-gray-500 mt-2">
          Se enviará un nuevo token de invitación al correo indicado.
        </p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-raised-button color="primary" [mat-dialog-close]="resendEmail" [disabled]="!resendEmail">Reenviar</button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    .detail-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 640px) {
      .detail-header {
        flex-wrap: wrap;
      }

      .header-actions {
        width: 100%;
        flex-direction: column;
      }

      .header-actions button {
        width: 100%;
      }
    }
  `],
})
export class ClientDetailPageComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  @ViewChild('firstInput') firstInput?: ElementRef<HTMLInputElement>;
  @ViewChild('resendDialogTemplate') resendDialogTemplate?: TemplateRef<any>;

  client!: Client;
  documents: Document[] = [];
  workflows: Workflow[] = [];

  isLoading = true;
  isEditing = false;
  isSaving = false;
  editData: Partial<Client> = {};

  accountants: User[] = [];

  filteredCities = [...COLOMBIAN_CITIES];

  ClientStatus = ClientStatus;

  statuses = Object.values(ClientStatus).map((v) => ({
    value: v,
    label: this.statusLabel(v),
  }));

  resendEmail = '';
  isResending = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private usersService: UsersService,
    private documentsService: DocumentsService,
    private workflowsService: WorkflowsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadAccountants();
    this.clientsService.findOne(id).subscribe({
      next: (client: Client) => {
        this.client = client;
        this.isLoading = false;
        this.loadDocuments();
        this.loadWorkflows();
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar el cliente', 'Cerrar', { duration: 3000 });
      },
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.isEditing) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEdit();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      this.saveClient();
    }
  }

  get hasChanges(): boolean {
    if (!this.isEditing || !this.client) return false;
    return (
      this.editData.firstName !== this.client.firstName ||
      this.editData.lastName !== this.client.lastName ||
      this.editData.email !== this.client.email ||
      (this.editData.phone ?? '') !== (this.client.phone ?? '') ||
      (this.editData.city ?? '') !== (this.client.city ?? '') ||
      (this.editData.address ?? '') !== (this.client.address ?? '') ||
      this.editData.status !== this.client.status ||
      (this.editData.assignedToId ?? null) !== (this.client.assignedToId ?? null) ||
      (this.editData.notes ?? '') !== (this.client.notes ?? '')
    );
  }

  canDeactivate(): boolean {
    if (this.hasChanges) {
      return confirm('Hay cambios sin guardar. ¿Deseas salir?');
    }
    return true;
  }

  loadAccountants(): void {
    this.usersService.findAll({ role: UserRole.CONTADOR }).subscribe({
      next: (users) => (this.accountants = users),
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

  openResendDialog(): void {
    if (!this.resendDialogTemplate) return;
    this.resendEmail = this.client.email;
    const dialogRef = this.dialog.open(this.resendDialogTemplate, {
      width: '420px',
    });
    dialogRef.afterClosed().subscribe((email: string | undefined) => {
      if (!email) return;
      this.isResending = true;
      const payload = email !== this.client.email ? { email } : {};
      this.clientsService.resendInvitation(this.client.id, payload).subscribe({
        next: (updated: Client) => {
          this.client = updated;
          this.isResending = false;
          this.snackBar.open('Invitación reenviada exitosamente', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {
          this.isResending = false;
          const msg = err.error?.message || 'Error al reenviar la invitación';
          this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
        },
      });
    });
  }

  updateCityFilter(): void {
    const value = (this.editData.city || '').toLowerCase();
    this.filteredCities = COLOMBIAN_CITIES.filter((c) =>
      c.toLowerCase().includes(value),
    );
  }

  startEdit(): void {
    this.editData = {
      firstName: this.client.firstName,
      lastName: this.client.lastName,
      email: this.client.email,
      phone: this.client.phone,
      city: this.client.city,
      address: this.client.address,
      status: this.client.status,
      assignedToId: this.client.assignedToId,
      notes: this.client.notes,
    };
    this.isEditing = true;
    setTimeout(() => this.firstInput?.nativeElement.focus(), 100);
  }

  cancelEdit(): void {
    if (this.hasChanges) {
      const confirmed = confirm('Hay cambios sin guardar. ¿Deseas descartarlos?');
      if (!confirmed) return;
    }
    this.editData = {};
    this.isEditing = false;
  }

  saveClient(): void {
    if (!this.editForm?.form?.valid) return;

    const payload: Partial<Client> = {};
    if (this.editData.firstName !== this.client.firstName) payload.firstName = this.editData.firstName;
    if (this.editData.lastName !== this.client.lastName) payload.lastName = this.editData.lastName;
    if (this.editData.email !== this.client.email) payload.email = this.editData.email;
    if ((this.editData.phone ?? '') !== (this.client.phone ?? '')) payload.phone = this.editData.phone;
    if ((this.editData.city ?? '') !== (this.client.city ?? '')) payload.city = this.editData.city;
    if ((this.editData.address ?? '') !== (this.client.address ?? '')) payload.address = this.editData.address;
    if (this.editData.status !== this.client.status) payload.status = this.editData.status;
    if ((this.editData.assignedToId ?? null) !== (this.client.assignedToId ?? null)) payload.assignedToId = this.editData.assignedToId;
    if ((this.editData.notes ?? '') !== (this.client.notes ?? '')) payload.notes = this.editData.notes;

    if (Object.keys(payload).length === 0) {
      this.isEditing = false;
      return;
    }

    this.isSaving = true;
    this.clientsService.update(this.client.id, payload).subscribe({
      next: (updated: Client) => {
        this.client = updated;
        this.isEditing = false;
        this.isSaving = false;
        this.editData = {};
        this.snackBar.open('Cliente actualizado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.isSaving = false;
        const msg = err.error?.message || 'Error al actualizar el cliente';
        this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
      },
    });
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
    return 'px-2 py-1 rounded text-sm font-medium ' + (STATUS_COLORS[status] || 'bg-blue-100 text-blue-700');
  }

  statusDotClass(status: ClientStatus): string {
    return (STATUS_COLORS[status] || 'bg-blue-100 text-blue-700').split(' ')[0];
  }
}
