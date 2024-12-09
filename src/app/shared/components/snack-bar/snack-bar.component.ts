import { Component, inject, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarInterface } from '../../models/snack-bar.interface';
import { AlertTypeEnum } from '../../enums/alert-type.enum';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatButtonModule,
  ],
  templateUrl: 'snack-bar.component.html',
  styleUrl: 'snack-bar.component.scss',
})
export class SnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
  color: string;
  title: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarInterface) {
    if (data.type === AlertTypeEnum.success) {
      this.title = 'Success';
      this.color = 'var(--sys-primary-container)';
    } else if (data.type === AlertTypeEnum.info) {
      this.title = 'Info';
      this.color = 'var(--sys-tertiary-container)';
    } else if (data.type === AlertTypeEnum.warning) {
      this.title = 'Warning';
      this.color = 'var(--sys-secondary-container)';
    } else {
      this.title = 'Error';
      this.color = 'var(--sys-error-container)';
    }
  }
}
