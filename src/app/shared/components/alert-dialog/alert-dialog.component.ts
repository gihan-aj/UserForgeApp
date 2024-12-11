import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { AlertDialog } from '../../models/alert-dialog.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'alert-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogContent],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss',
})
export class AlertDialogComponent {
  readonly dialogeRef = inject(MatDialogRef<AlertDialogComponent>);
  readonly data = inject<AlertDialog>(MAT_DIALOG_DATA);

  onOk(): void {
    this.dialogeRef.close();
  }
}
