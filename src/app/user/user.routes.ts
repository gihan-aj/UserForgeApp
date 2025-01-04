import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from '../shared/guards/login.guard';
import { RegistrationComponent } from './components/registration/registration.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { authGuard } from '../shared/guards/auth.guard';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { breadcrumb: 'login' },
    canActivate: [loginGuard],
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    data: { breadcrumb: 'registration' },
    canActivate: [loginGuard],
  },
  {
    path: 'confirm-email',
    component: ConfirmEmailComponent,
    data: { breadcrumb: 'confirm email' },
    canActivate: [loginGuard],
  },
  {
    path: 'send-email/:mode',
    component: SendEmailComponent,
    data: { breadcrumb: 'send email' },
    canActivate: [loginGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    data: { breadcrumb: 'reset password' },
    canActivate: [loginGuard],
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    data: { breadcrumb: 'user profile' },
    canActivate: [authGuard],
  },
  {
    path: 'user-settings',
    component: UserSettingsComponent,
    data: { breadcrumb: 'user settings' },
    canActivate: [authGuard],
  },
];
