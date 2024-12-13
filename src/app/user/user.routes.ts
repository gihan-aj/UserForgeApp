import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from '../shared/guards/login.guard';
import { RegistrationComponent } from './components/registration/registration.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { SendEmailComponent } from './components/send-email/send-email.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { breadcrumb: 'Login' },
    canActivate: [loginGuard],
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    data: { breadcrumb: 'Registration' },
    canActivate: [loginGuard],
  },
  {
    path: 'confirm-email',
    component: ConfirmEmailComponent,
    data: { breadcrumb: 'Confirm email' },
    canActivate: [loginGuard],
  },
  {
    path: 'send-email/:mode',
    component: SendEmailComponent,
    data: { breadcrumb: 'Send email' },
    canActivate: [loginGuard],
  },
];
