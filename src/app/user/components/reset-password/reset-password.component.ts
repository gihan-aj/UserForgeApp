import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { DataValidationService } from '../../../shared/services/data-validation.service';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { MessageService } from '../../../shared/services/message.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirstKeyPipe } from '../../../shared/pipes/first-key.pipe';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../../shared/constants/constraints';
import { JwtTokenService } from '../../../shared/services/jwt-token.service';
import { ResetPasswordRequest } from '../../models/reset-password-request';
import { NotificationType } from '../../../shared/enums/notification-type.enum';
import { MESSAGES } from '../../../shared/constants/messages';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FirstKeyPipe,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  fb = inject(FormBuilder);
  dataValidation = inject(DataValidationService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public messageService: MessageService,
    private userService: UserService,
    private errorHandling: ErrorHandlingService,
    private alertService: AlertService
  ) {}

  isSubmitted: boolean = false;
  isLoading: boolean = false;
  passwordMaxLength = PASSWORD_MAX_LENGTH;
  passwordMinLength = PASSWORD_MIN_LENGTH;

  userId: string | undefined;
  passwordResetToken: string | undefined;

  form = this.fb.nonNullable.group(
    {
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

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (userId && token) {
      this.userId = userId;
      this.passwordResetToken = token;
    } else {
      this.alertService.showAlert(
        NotificationType.danger,
        this.messageService.getMassage(
          'user.alerts.danger.titles.passwordResetTokenError'
        ),
        this.messageService.getMassage(
          'user.alerts.danger.messages.passwordResetTokenError'
        )
      );

      this.router.navigateByUrl('/user/login');
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.form.valid) {
      this.isLoading = true;

      if (this.userId && this.passwordResetToken) {
        const request: ResetPasswordRequest = {
          userId: this.userId,
          token: this.passwordResetToken,
          newPassword: this.form.value.password,
        };
        this.userService.resetPassword(request).subscribe({
          next: () => {
            this.alertService.showAlert(
              NotificationType.success,
              this.messageService.getMassage(
                'user.alerts.success.titles.passwordResetSuccessful'
              ),
              this.messageService.getMassage(
                'user.alerts.success.messages.passwordResetSuccessful'
              )
            );

            this.router.navigateByUrl('/user/login');

            this.isLoading = false;
            this.form.markAsPristine();
            this.form.reset();
            this.isSubmitted = false;
          },
          error: (error) => {
            this.errorHandling.handle(error);
            this.isLoading = false;
          },
        });
      }
    }
  }
}
