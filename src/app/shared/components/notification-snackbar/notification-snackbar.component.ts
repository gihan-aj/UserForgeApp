import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSnackBarLabel,
  MatSnackBarActions,
  MatSnackBarAction,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { NotificationSnackbar } from '../../models/notification-snackbar.model';
import { NotificationType } from '../../enums/notification-type.enum';

@Component({
  selector: 'notification-snackbar',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './notification-snackbar.component.html',
  styleUrl: './notification-snackbar.component.scss',
})
export class NotificationSnackbarComponent {
  snackbarRef = inject(MatSnackBarRef);
  color: string;
  icon: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: NotificationSnackbar) {
    if (data.type === NotificationType.success) {
      this.color = 'var(--sys-primary-container)';
      this.icon = 'check_circle';
    } else if (data.type === NotificationType.info) {
      this.color = 'var(--sys-tertiary-container)';
      this.icon = 'info';
    } else if (data.type === NotificationType.warning) {
      this.color = 'var(--sys-secondary-container)';
      this.icon = 'warning';
    } else {
      this.color = 'var(--sys-error-container)';
      this.icon = 'error';
    }
  }
}
