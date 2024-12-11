import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationSnackbar } from '../models/notification-snackbar.model';
import { NotificationSnackbarComponent } from '../components/notification-snackbar/notification-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Displays a notification using Angular Material's SnackBar.
   *
   * @param {NotificationType} type - The type of notification (e.g., success, info, warning, danger).
   * @param {string} message - The message to display in the notification.
   * @param {number} [duration=5000] - The duration in milliseconds for which the notification is displayed (default is 5000 ms).
   *
   * @returns {void}
   */
  showNotification(
    type: NotificationType,
    message: string,
    duration = 5000
  ): void {
    const notification: NotificationSnackbar = {
      type: type,
      message: message,
    };

    this.snackBar.openFromComponent(NotificationSnackbarComponent, {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      data: notification,
    });
  }
}
