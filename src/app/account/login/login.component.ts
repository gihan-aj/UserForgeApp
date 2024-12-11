import { Component, inject, OnInit, signal } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../account.service';
import { LoginRequestInterface } from './login-request.interface';
import { AlertService } from '../../shared/services/alert.service';
import { ErrorHandlingService } from '../../shared/services/error-handling.service';
import { AlertType } from '../../shared/enums/alert-type.enum';
import { errorFeedbackAnimation } from '../../shared/animations/error-feedback.animation';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';

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
    FirstKeyPipe,
  ],
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.scss',
  animations: [errorFeedbackAnimation],
})
export class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private snackBar = inject(SnackBarService);
  private errorHandling = inject(ErrorHandlingService);

  returnUrl: string | null = null;

  isRequestPending: boolean = false;
  isSubmitted: boolean = false;

  emailMaxLength = 100;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor() {
    if (this.authService.currentUserSig()) {
      this.snackBar.showNotification(
        AlertType.info,
        'You have already logged in.'
      );
      this.router.navigateByUrl('/dashboard');
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

  ngOnInit(): void {}

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.loginForm.valid) {
      const request: LoginRequestInterface = this.loginForm.getRawValue();

      this.isRequestPending = true;

      this.accountService.login(request).subscribe({
        next: () => {
          this.loginForm.reset();
          this.loginForm.markAsPristine();

          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl('/dashboard');
          }

          this.isRequestPending = false;
        },
        error: (error) => {
          this.errorHandling.handle(error);
          this.isRequestPending = false;
        },
      });
    }

    // console.log('login');
    // this.isRequestPending = true;
    // const request: LoginRequestInterface = this.loginForm.getRawValue();

    // this.accountService.login(request).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     this.alerService.alert(
    //       AlertType.success,
    //       'Success',
    //       `${response.firstName} has logged in successfully.`
    //     );
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     this.errorHandling.handle(error);
    //     this.isRequestPending = false;
    //   },
    //   complete: () => {
    //     this.isRequestPending = false;
    //   },
    // });
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched))
    );
  }
}
