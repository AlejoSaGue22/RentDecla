export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  tenantSlug?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  CONTADOR = 'contador',
  CLIENT = 'client',
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  isActive: boolean;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentType?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  status: ClientStatus;
  tenantId: string;
  assignedTo?: User;
  taxProfile?: TaxProfile;
  createdAt: string;
}

export enum ClientStatus {
  PENDING_INVITATION = 'pending_invitation',
  PENDING_PROFILE = 'pending_profile',
  PENDING_DOCUMENTS = 'pending_documents',
  IN_REVIEW = 'in_review',
  REQUIRES_CORRECTION = 'requires_correction',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface TaxProfile {
  id: string;
  clientId: string;
  rut?: string;
  hasIngresosLaborales?: boolean;
  hasIngresosIndependientes?: boolean;
  hasPropiedades?: boolean;
  hasVehiculos?: boolean;
  hasInversiones?: boolean;
  hasDependientes?: boolean;
  ingresosAnuales?: number;
  patrimonioBruto?: number;
  taxYear?: number;
}

export interface Document {
  id: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  category?: string;
  status: DocumentStatus;
  clientId: string;
  documentRequestId?: string;
  createdAt: string;
}

export enum DocumentStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface DocumentRequest {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  priority: number;
  isRequired: boolean;
  clientId: string;
  documents: Document[];
}

export interface Workflow {
  id: string;
  type: WorkflowType;
  status: WorkflowStatus;
  taxYear: number;
  clientId: string;
  client?: Client;
  startedAt?: string;
  completedAt?: string;
  dueDate?: string;
  notes?: string;
}

export enum WorkflowType {
  DECLARACION_RENTA = 'declaracion_renta',
  DECLARACION_SIMPLIFICADA = 'declaracion_simplificada',
}

export enum WorkflowStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  AWAITING_DOCUMENTS = 'awaiting_documents',
  IN_REVIEW = 'in_review',
  COMPLETED = 'completed',
}

export interface DashboardStats {
  totalClients: number;
  pendingClients: number;
  completedClients: number;
  inReviewClients: number;
  activeWorkflows: number;
  completedWorkflows: number;
  pendingDocuments: number;
  totalUsers: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
