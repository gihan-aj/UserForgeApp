import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserInterface } from '../../../models/user.interface';
import { DataValidationService } from '../../../../shared/services/data-validation.service';
import { MessageService } from '../../../../shared/services/message.service';
import {
  FIRST_NAME_MIN_LENGTH,
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MIN_LENGTH,
  LAST_NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  USER_MIN_AGE,
} from '../../../../shared/constants/constraints';
import { FirstKeyPipe } from '../../../../shared/pipes/first-key.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EditUserDetails } from '../../../models/edit-user-details.interface';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-edit-user-details-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FirstKeyPipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-user-details-dialog.component.html',
  styleUrl: './edit-user-details-dialog.component.scss',
})
export class EditUserDetailsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EditUserDetailsDialogComponent>);
  data = inject<EditUserDetails>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  public dataValidation = inject(DataValidationService);
  public messageService = inject(MessageService);

  isSubmitted: boolean = false;
  isRequestPending: boolean = false;
  firstNameMinLength = FIRST_NAME_MIN_LENGTH;
  firstNameMaxLength = FIRST_NAME_MAX_LENGTH;
  lastNameMinLength = LAST_NAME_MIN_LENGTH;
  lastNameMaxLength = LAST_NAME_MAX_LENGTH;
  passwordMinLength = PASSWORD_MIN_LENGTH;
  passwordMaxLength = PASSWORD_MAX_LENGTH;
  minAge = USER_MIN_AGE;

  form = this.fb.group({
    email: [this.data.email],
    firstName: [
      this.data.firstName,
      [
        Validators.required,
        Validators.minLength(this.firstNameMinLength),
        Validators.maxLength(this.firstNameMaxLength),
      ],
    ],
    lastName: [
      this.data.lastName,
      [
        Validators.required,
        Validators.minLength(this.lastNameMinLength),
        Validators.maxLength(this.lastNameMaxLength),
      ],
    ],
    phoneNumber: [
      this.data.phoneNumber,
      Validators.pattern(/^[+]?[0-9]{7,15}$/),
    ],
    dateOfBirth: [
      this.data.dateOfBirth,
      this.dataValidation.minimumAgeValidator(this.minAge),
    ],
  });

  get email() {
    return this.form.get('email');
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
  get dateOfBirth() {
    return this.form.get('dateOfBirth');
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }
}
