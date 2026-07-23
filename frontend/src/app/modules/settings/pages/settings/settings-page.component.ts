import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TenantsService } from '../../../../core/services/tenants.service';
import { UsersService } from '../../../../core/services/users.service';
import { Tenant, User, UserRole } from '../../../../core/models';

@Component({
  selector: 'app-settings-page',
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
    MatTabsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="settings-container animate-fade-in max-w-5xl mx-auto">
      <div class="header-section mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Configuración</h1>
        <p class="subtitle text-sm text-slate-500">Administra el perfil de tu organización y tu equipo de contadores</p>
      </div>

      <mat-tab-group class="settings-tabs mt-4">
        <!-- Pestaña 1: Perfil de la Firma -->
        <mat-tab label="Firma Contable">
          <div class="py-6">
            <mat-card class="p-6">
              <div *ngIf="loadingTenant" class="flex justify-center items-center py-8">
                <mat-spinner diameter="45"></mat-spinner>
              </div>

              <form *ngIf="!loadingTenant && tenant" (ngSubmit)="saveTenant()" class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold text-slate-800">Datos Organizacionales</h3>
                  <p class="text-xs text-slate-500">Configura la identidad de tu firma en el portal</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Nombre de la Firma</mat-label>
                    <input matInput [(ngModel)]="tenant.name" name="tenantName" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Slug (Identificador único de URL)</mat-label>
                    <input matInput [(ngModel)]="tenant.slug" name="tenantSlug" readonly [disabled]="true">
                    <mat-hint>El slug no se puede cambiar ya que afecta las URL de acceso.</mat-hint>
                  </mat-form-field>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>URL del Logotipo</mat-label>
                    <input matInput [(ngModel)]="tenant.logoUrl" name="logoUrl">
                    <mat-icon matSuffix>image</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Color Primario (Hexadecimal, ej: #2563eb)</mat-label>
                    <input matInput [(ngModel)]="tenant.primaryColor" name="primaryColor" placeholder="#2563eb">
                    <span matSuffix class="inline-block w-6 h-6 rounded-md border" [style.backgroundColor]="tenant.primaryColor"></span>
                  </mat-form-field>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Prefijo para Archivos / Documentos</mat-label>
                    <input matInput [(ngModel)]="tenant.documentPrefix" name="documentPrefix" placeholder="EJ: CONT-">
                  </mat-form-field>
                </div>

                <div class="flex justify-end mt-4">
                  <button mat-raised-button color="primary" type="submit" [disabled]="savingTenant">
                    <mat-spinner *ngIf="savingTenant" diameter="20" class="inline-block mr-2"></mat-spinner>
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Pestaña 2: Gestión de Equipo -->
        <mat-tab label="Miembros del Equipo">
          <div class="py-6 space-y-6">
            <!-- Formulario para agregar miembro (toggleable) -->
            <mat-card class="p-6">
              <div class="flex justify-between items-center mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-slate-800">Miembros Registrados</h3>
                  <p class="text-xs text-slate-500">Administra los accesos de los contadores a tu firma</p>
                </div>
                <button
                  mat-raised-button
                  color="primary"
                  *ngIf="!showAddMemberForm"
                  (click)="showAddMemberForm = true"
                >
                  <mat-icon>person_add</mat-icon>
                  Agregar Miembro
                </button>
              </div>

              <!-- Formulario de nuevo miembro -->
              <form *ngIf="showAddMemberForm" (ngSubmit)="addMember()" class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 space-y-4 animate-scale-in">
                <h4 class="text-sm font-bold text-slate-700">Registrar Nuevo Miembro</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Nombre Completo</mat-label>
                    <input matInput [(ngModel)]="newMember.name" name="memberName" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Correo Electrónico</mat-label>
                    <input matInput type="email" [(ngModel)]="newMember.email" name="memberEmail" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Contraseña</mat-label>
                    <input matInput type="password" [(ngModel)]="newMember.password" name="memberPassword" required>
                  </mat-form-field>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Teléfono</mat-label>
                    <input matInput [(ngModel)]="newMember.phone" name="memberPhone">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Rol</mat-label>
                    <mat-select [(ngModel)]="newMember.role" name="memberRole" required>
                      <mat-option [value]="'contador'">Contador Asistente</mat-option>
                      <mat-option [value]="'admin'">Administrador de Firma</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <div class="flex items-end justify-end gap-3 h-full pb-2">
                    <button mat-stroked-button type="button" (click)="cancelAddMember()">Cancelar</button>
                    <button mat-raised-button color="primary" type="submit" [disabled]="savingMember">
                      <mat-spinner *ngIf="savingMember" diameter="18" class="inline-block mr-1"></mat-spinner>
                      Registrar
                    </button>
                  </div>
                </div>
              </form>

              <!-- Tabla de miembros -->
              <div *ngIf="loadingMembers" class="flex justify-center items-center py-8">
                <mat-spinner diameter="40"></mat-spinner>
              </div>

              <div *ngIf="!loadingMembers && members.length === 0" class="text-center py-8 text-slate-500 text-sm">
                No hay miembros registrados en el equipo.
              </div>

              <div *ngIf="!loadingMembers && members.length > 0" class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th class="py-3 px-4">Nombre</th>
                      <th class="py-3 px-4">Correo</th>
                      <th class="py-3 px-4">Teléfono</th>
                      <th class="py-3 px-4">Rol</th>
                      <th class="py-3 px-4">Estado</th>
                      <th class="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let member of members" class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td class="py-4 px-4 font-medium text-slate-800">{{ member.name }}</td>
                      <td class="py-4 px-4 text-sm text-slate-500">{{ member.email }}</td>
                      <td class="py-4 px-4 text-sm text-slate-500">{{ member.phone || '—' }}</td>
                      <td class="py-4 px-4">
                        <span [class]="getRoleClass(member.role)">
                          {{ getRoleLabel(member.role) }}
                        </span>
                      </td>
                      <td class="py-4 px-4">
                        <span [class]="member.isActive ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-semibold' : 'text-slate-400 bg-slate-50 px-2 py-0.5 rounded text-xs font-semibold'">
                          {{ member.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="py-4 px-4 text-right space-x-1">
                        <button
                          mat-icon-button
                          color="warn"
                          [disabled]="member.email === 'superadmin@rentdecla.com'"
                          (click)="deleteMember(member)"
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
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1000px;
    }
  `],
})
export class SettingsPageComponent implements OnInit {
  // Tenant Profile State
  tenant!: Tenant;
  loadingTenant = false;
  savingTenant = false;

  // Team Management State
  members: User[] = [];
  loadingMembers = false;
  showAddMemberForm = false;
  savingMember = false;

  newMember = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: UserRole.CONTADOR,
  };

  constructor(
    private tenantsService: TenantsService,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadTenant();
    this.loadMembers();
  }

  loadTenant(): void {
    this.loadingTenant = true;
    this.tenantsService.getMe().subscribe({
      next: (data: Tenant) => {
        this.tenant = data;
        this.loadingTenant = false;
      },
      error: (err) => {
        console.error('Error loading tenant profile:', err);
        this.loadingTenant = false;
        this.snackBar.open('Error al cargar la información de la firma', 'Cerrar', { duration: 3000 });
      },
    });
  }

  saveTenant(): void {
    if (!this.tenant) return;
    this.savingTenant = true;
    this.tenantsService.updateMe(this.tenant).subscribe({
      next: (data: Tenant) => {
        this.tenant = data;
        this.savingTenant = false;
        this.snackBar.open('Perfil organizacional guardado con éxito', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error updating tenant profile:', err);
        this.savingTenant = false;
        this.snackBar.open('Error al guardar la configuración', 'Cerrar', { duration: 3000 });
      },
    });
  }

  loadMembers(): void {
    this.loadingMembers = true;
    this.usersService.findAll().subscribe({
      next: (data: User[]) => {
        this.members = data;
        this.loadingMembers = false;
      },
      error: (err) => {
        console.error('Error loading team members:', err);
        this.loadingMembers = false;
        this.snackBar.open('Error al cargar el equipo', 'Cerrar', { duration: 3000 });
      },
    });
  }

  addMember(): void {
    if (!this.newMember.name || !this.newMember.email || !this.newMember.password) return;

    this.savingMember = true;
    this.usersService.create(this.newMember).subscribe({
      next: () => {
        this.savingMember = false;
        this.showAddMemberForm = false;
        this.newMember = {
          name: '',
          email: '',
          password: '',
          phone: '',
          role: UserRole.CONTADOR,
        };
        this.snackBar.open('Miembro del equipo registrado con éxito', 'Cerrar', { duration: 3000 });
        this.loadMembers();
      },
      error: (err) => {
        console.error('Error registering team member:', err);
        this.savingMember = false;
        this.snackBar.open('Error al registrar al miembro', 'Cerrar', { duration: 3000 });
      },
    });
  }

  cancelAddMember(): void {
    this.showAddMemberForm = false;
    this.newMember = {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: UserRole.CONTADOR,
    };
  }

  deleteMember(member: User): void {
    if (confirm(`¿Estás seguro de que deseas eliminar a "${member.name}" de tu firma?`)) {
      this.usersService.remove(member.id).subscribe({
        next: () => {
          this.snackBar.open('Miembro eliminado con éxito', 'Cerrar', { duration: 3000 });
          this.loadMembers();
        },
        error: (err) => {
          console.error('Error removing team member:', err);
          this.snackBar.open('Error al eliminar al miembro', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Administrador de Firma',
      contador: 'Contador',
      client: 'Cliente',
    };
    return labels[role] || role;
  }

  getRoleClass(role: string): string {
    const classes: Record<string, string> = {
      super_admin: 'px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800',
      admin: 'px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800',
      contador: 'px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800',
      client: 'px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800',
    };
    return classes[role] || 'px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800';
  }
}
