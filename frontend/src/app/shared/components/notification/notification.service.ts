import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  success(message: string, duration: number = 3000) {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration: number = 5000) {
    this.show({ type: 'error', message, duration });
  }

  info(message: string, duration: number = 3000) {
    this.show({ type: 'info', message, duration });
  }

  warning(message: string, duration: number = 4000) {
    this.show({ type: 'warning', message, duration });
  }

  private show(notification: Notification) {
    this.notificationSubject.next(notification);
  }
} 