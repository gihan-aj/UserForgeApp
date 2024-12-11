import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Error } from '../models/error.model';
import { NotificationType } from '../enums/notification-type.enum';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  readonly dialog = inject(MatDialog);

  showAlert(
    type: NotificationType,
    title: string,
    message: string,
    description: Error[] = []
  ): void {
    let errors: string[] = [];
    if (description !== null && description.length > 0) {
      errors = description.map((e) => {
        return e.description;
      });
    }
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { type: type, title: title, text: message, detail: errors },
    });
  }
}
