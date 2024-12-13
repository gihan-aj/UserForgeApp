import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMAIL_MAX_LENGTH } from '../../../shared/constants/constraints';
import { DataValidationService } from '../../../shared/services/data-validation.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FirstKeyPipe } from '../../../shared/pipes/first-key.pipe';
import { MessageService } from '../../../shared/services/message.service';
import { UserService } from '../../services/user.service';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { AlertService } from '../../../shared/services/alert.service';
import { NotificationType } from '../../../shared/enums/notification-type.enum';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FirstKeyPipe,
  ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss',
})
export class SendEmailComponent implements OnInit {
  fb = inject(FormBuilder);

  constructor(
    private route: ActivatedRoute,
    public dataValidation: DataValidationService,
    private router: Router,
    public messageService: MessageService,
    private userService: UserService,
    private errorHandling: ErrorHandlingService,
    private alerService: AlertService
  ) {}

  mode: string | undefined;
  emailMaxLength = EMAIL_MAX_LENGTH;
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  isSuccess: boolean | null = null;

  form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(this.emailMaxLength),
      ],
    ],
  });

  get email() {
    return this.form.get('email');
  }

  ngOnInit(): void {
    const mode = this.route.snapshot.paramMap.get('mode');
    if (mode) {
      this.mode = mode;
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.form.valid && this.mode) {
      if (this.mode.includes('resend-email-confirmation-link')) {
        const email = this.form.value.email;
        if (email) {
          this.isLoading = true;

          this.userService.resendEmailConfirmationLink(email).subscribe({
            next: () => {
              this.alerService.showAlert(
                NotificationType.success,
                this.messageService.getMassage(
                  'user.alerts.success.titles.emailConfirmationLinkResent'
                ),
                this.messageService.getMassage(
                  'user.alerts.success.messages.emailConfirmationLinkResent'
                )
              );

              this.isLoading = false;
              this.form.reset();
              this.isSubmitted = false;
            },
            error: (error) => {
              if (
                error &&
                error.type &&
                error.type === 'EmailAlreadyConfirmed'
              ) {
                this.router.navigateByUrl('/user/login');
              }
              this.errorHandling.handle(error);
              this.isLoading = false;
            },
          });
        }
      }
    }
  }

  onCancel(): void {
    this.router.navigateByUrl('user/login');
  }
}
