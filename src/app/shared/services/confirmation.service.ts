import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationType } from '../enums/notification-type.enum';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialog } from '../models/confirmation-dialog.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  readonly dialog = inject(MatDialog);

  openConfirmationDialog(
    type: NotificationType,
    title: string,
    text: string,
    action: string
  ): MatDialogRef<ConfirmationDialogComponent, any> {
    const data: ConfirmationDialog = {
      type: type,
      title: title,
      text: text,
      action: action,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: data,
    });
    return dialogRef;
  }
}
