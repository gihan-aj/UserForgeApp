import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { AlertService } from '../../shared/services/alert.service';
import { ErrorHandlingService } from '../../shared/services/error-handling.service';
import { AlertType } from '../../shared/enums/alert-type.enum';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FirstKeyPipe,
  ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss',
})
export class SendEmailComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private alertService = inject(AlertService);
  private errorHandling = inject(ErrorHandlingService);
  private router = inject(Router);

  mode: string = '';
  isSubmitted: boolean = false;
  isRequestPending: boolean = false;
  emailMaxLength = 100;

  emailForm = this.fb.nonNullable.group({
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
    return this.emailForm.get('email');
  }

  ngOnInit(): void {
    const mode = this.activatedRoute.snapshot.paramMap.get('mode');
    if (mode) {
      this.mode = mode;
    }
  }

  sendEmail() {
    this.isSubmitted = true;

    if (this.emailForm.valid && this.mode) {
      if (this.mode.includes('resend-email-confirmation-link')) {
        const email = this.emailForm.value.email;
        if (email) {
          this.isRequestPending = true;

          this.accountService.resendActivationLink(email).subscribe({
            next: () => {
              this.alertService.alert(
                AlertType.success,
                'Email Sent',
                'Email sent successfully. Check you inbox.'
              );

              this.isRequestPending = false;
              this.emailForm.reset();
              this.isSubmitted = false;

              // this.router.navigateByUrl('/account/login');
            },
            error: (error) => {
              this.errorHandling.handle(error);
              this.isRequestPending = false;
            },
          });
        }
      }
    }
  }

  cancel() {
    this.router.navigateByUrl('/account/login');
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.emailForm.get(controlName);
    1;
    return (
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched))
    );
  }
}
