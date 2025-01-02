import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { FirstKeyPipe } from '../../../shared/pipes/first-key.pipe';
import { NotificationType } from '../../../shared/enums/notification-type.enum';
import { EMAIL_MAX_LENGTH } from '../../../shared/constants/constraints';
import { MESSAGES } from '../../../shared/constants/messages';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginUser } from '../../models/login-user.interface';
import { DataValidationService } from '../../../shared/services/data-validation.service';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FirstKeyPipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private errorHandling = inject(ErrorHandlingService);
  public dataValidation = inject(DataValidationService);
  public messageService = inject(MessageService);

  private returnUrl: string | null = null;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor() {
    if (this.userService.getUser()) {
      this.notificationService.showNotification(
        NotificationType.info,
        MESSAGES.user.notifications.info.alreadyLoggedIn
      );
      this.router.navigateByUrl('./dashboard');
    } else {
      this.activatedRoute.queryParamMap.subscribe({
        next: (params: any) => {
          if (params) {
            this.returnUrl = params.get('returnUrl');
          }
        },
      });
    }
  }

  public isRequestPending: boolean = false;
  public isSubmitted: boolean = false;
  public emailMaxLength = EMAIL_MAX_LENGTH;

  public form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  public onSubmit(): void {
    this.isSubmitted = true;

    if (this.form.valid) {
      const request: LoginUser = this.form.getRawValue();

      this.isRequestPending = true;

      this.userService.login(request).subscribe({
        next: () => {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl('/dashboard');
          }

          this.form.reset();
          this.form.markAsPristine();
          this.isRequestPending = false;
        },
        error: (error) => {
          this.errorHandling.handle(error);
          this.isRequestPending = false;

          if (
            error.error &&
            error.error.type &&
            error.error.type === 'EmailNotConfirmed'
          ) {
            this.router.navigateByUrl(
              '/user/send-email/resend-email-confirmation-link'
            );
          }
        },
      });
    }
  }

  public hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched))
    );
  }
}
