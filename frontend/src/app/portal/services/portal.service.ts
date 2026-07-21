import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PortalProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  status: string;
  taxProfile?: any;
  workflows: any[];
  summary: {
    totalWorkflows: number;
    pendingDocumentRequests: number;
    rejectedDocuments: number;
  };
}

export interface PortalDocument {
  id: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  category?: string;
  status: string;
  createdAt: string;
  rejectionReason?: string;
}

export interface PortalDocumentRequest {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  priority: number;
  isRequired: boolean;
  documents: PortalDocument[];
}

export interface PortalNotification {
  id: string;
  subject: string;
  content: string;
  type: string;
  status: string;
  createdAt: string;
  readAt?: string;
}

@Injectable({ providedIn: 'root' })
export class PortalService {
  private apiUrl = `${environment.apiUrl}/portal`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<PortalProfile> {
    return this.http.get<PortalProfile>(`${this.apiUrl}/me`);
  }

  getDocuments(): Observable<PortalDocument[]> {
    return this.http.get<PortalDocument[]>(`${this.apiUrl}/documents`);
  }

  uploadDocument(file: File, category?: string, documentRequestId?: string): Observable<PortalDocument> {
    const formData = new FormData();
    formData.append('file', file);
    if (category) formData.append('category', category);
    if (documentRequestId) formData.append('documentRequestId', documentRequestId);
    return this.http.post<PortalDocument>(`${this.apiUrl}/documents/upload`, formData);
  }

  getDocumentRequests(): Observable<PortalDocumentRequest[]> {
    return this.http.get<PortalDocumentRequest[]>(`${this.apiUrl}/document-requests`);
  }

  getWorkflows(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/workflows`);
  }

  getNotifications(): Observable<PortalNotification[]> {
    return this.http.get<PortalNotification[]>(`${this.apiUrl}/notifications`);
  }

  markNotificationRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/notifications/${id}/read`, {});
  }

  updateProfile(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/profile`, data);
  }
}
