import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: string;
  subject: string;
  content: string;
  type: 'email' | 'whatsapp' | 'in_app';
  status: 'pending' | 'sent' | 'failed' | 'read';
  createdAt: string;
  readAt?: string;
  clientId?: string;
  userId?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(clientId?: string): Observable<Notification[]> {
    const params: any = {};
    if (clientId) {
      params.clientId = clientId;
    }
    return this.http.get<Notification[]>(this.apiUrl, { params });
  }

  markAsRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {});
  }

  getUnreadCount(clientId?: string): Observable<number> {
    return new Observable((observer) => {
      this.getNotifications(clientId).subscribe({
        next: (notifications) => {
          const unreadCount = notifications.filter((n) => !n.readAt).length;
          observer.next(unreadCount);
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }
}
