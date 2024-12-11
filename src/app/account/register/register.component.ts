import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { errorFeedbackAnimation } from '../../shared/animations/error-feedback.animation';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AccountService } from '../account.service';
import { ErrorHandlingService } from '../../shared/services/error-handling.service';
import { AlertService } from '../../shared/services/alert.service';
import { AlertType } from '../../shared/enums/alert-type.enum';
import { AuthService } from '../../shared/services/auth.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FirstKeyPipe,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  animations: [errorFeedbackAnimation],
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private snackBar = inject(SnackBarService);
  private errorHandlingService = inject(ErrorHandlingService);
  private alertService = inject(AlertService);

  isSubmitted: boolean = false;

  isRequestPending: boolean = false;

  nameMinLength = 3;
  nameMaxLength = 100;
  passwordMinLength = 6;

  // Password validators
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value != confirmPassword.value
    ) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }

    return null;
  };

  requireDigitValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const hasDigit = /\d/.test(control.value);
    return hasDigit ? null : { requireDigit: true };
  };

  requireLowercaseValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const hasLowercase = /[a-z]/.test(control.value);
    return hasLowercase ? null : { requireLowercase: true };
  };

  requireUppercaseValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const hasUppercase = /[A-Z]/.test(control.value);
    return hasUppercase ? null : { requireUppercase: true };
  };

  requireNonAlphanumericValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(control.value);
    return hasNonAlphanumeric ? null : { requireNonAlphanumeric: true };
  };

  registerForm = this.fb.nonNullable.group(
    {
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(this.nameMinLength),
          Validators.maxLength(this.nameMaxLength),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(this.nameMinLength),
          Validators.maxLength(this.nameMaxLength),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(this.nameMaxLength),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(this.passwordMinLength),
          this.requireDigitValidator,
          this.requireLowercaseValidator,
          this.requireUppercaseValidator,
          this.requireNonAlphanumericValidator,
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  ngOnInit(): void {
    if (this.authService.currentUserSig()) {
      this.snackBar.showNotification(
        AlertType.info,
        'You have already logged in.'
      );
      this.router.navigateByUrl('/dashboard');
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.registerForm.valid) {
      this.isRequestPending = true;
      this.accountService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.alertService.alert(
            AlertType.success,
            'User Created',
            'User created successfully. Check your email inbox for the activation link'
          );

          this.isRequestPending = false;
          this.registerForm.reset();
          this.registerForm.markAsPristine();
          this.isSubmitted = false;
        },
        error: (error) => {
          console.log(error);
          this.errorHandlingService.handle(error);
          this.isRequestPending = false;
        },
      });
    }
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched))
    );
  }
}
