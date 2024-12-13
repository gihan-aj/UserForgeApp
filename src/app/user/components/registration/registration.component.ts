import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { AlertService } from '../../../shared/services/alert.service';
import {
  EMAIL_MAX_LENGTH,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_MIN_LENGTH,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USER_MIN_AGE,
} from '../../../shared/constants/constraints';
import { DataValidationService } from '../../../shared/services/data-validation.service';
import { NotificationType } from '../../../shared/enums/notification-type.enum';
import { MESSAGES } from '../../../shared/constants/messages';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirstKeyPipe } from '../../../shared/pipes/first-key.pipe';
import { MessageService } from '../../../shared/services/message.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-registration',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    FirstKeyPipe,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  fb = inject(FormBuilder);
  public dataValidation = inject(DataValidationService);
  public messageService = inject(MessageService);

  constructor(
    private userService: UserService,
    private errorHandling: ErrorHandlingService,
    private alertService: AlertService
  ) {}

  isSubmitted: boolean = false;
  isRequestPending: boolean = false;
  firstNameMinLength = FIRST_NAME_MIN_LENGTH;
  firstNameMaxLength = FIRST_NAME_MAX_LENGTH;
  lastNameMinLength = LAST_NAME_MIN_LENGTH;
  lastNameMaxLength = LAST_NAME_MAX_LENGTH;
  emailMaxLength = EMAIL_MAX_LENGTH;
  passwordMinLength = PASSWORD_MIN_LENGTH;
  passwordMaxLength = PASSWORD_MAX_LENGTH;
  minAge = USER_MIN_AGE;

  form = this.fb.group(
    {
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(this.firstNameMinLength),
          Validators.maxLength(this.firstNameMaxLength),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(this.lastNameMinLength),
          Validators.maxLength(this.lastNameMaxLength),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(this.emailMaxLength),
        ],
      ],
      phoneNumber: ['', Validators.pattern(/^[+]?[0-9]{7,15}$/)],
      dateOfBirth: [
        '',
        [
          // Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
          this.dataValidation.minimumAgeValidator(this.minAge),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(this.passwordMinLength),
          this.dataValidation.requireDigitValidator,
          this.dataValidation.requireLowercaseValidator,
          this.dataValidation.requireUppercaseValidator,
          this.dataValidation.requireNonAlphanumericValidator,
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.dataValidation.passwordMatchValidator }
  );

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }

  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
  get dateOfBirth() {
    return this.form.get('dateOfBirth');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.form.valid) {
      this.isRequestPending = true;
      const request = this.form.getRawValue();
      this.userService.register(request).subscribe({
        next: (response) => {
          console.log(response);

          this.alertService.showAlert(
            NotificationType.success,
            MESSAGES.user.alerts.success.titles.registrationSuccess,
            response.message
          );

          // this.router.navigateByUrl('user/login');

          this.isRequestPending = false;
          this.form.markAsPristine();
          this.form.reset();
          this.isSubmitted = false;
        },
        error: (error) => {
          this.errorHandling.handle(error);
          this.isRequestPending = false;
        },
      });
    }
  }
}
