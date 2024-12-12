import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './register/register.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { loginGuard } from '../shared/guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { breadcrumb: 'Login' },
    canActivate: [loginGuard],
  },
  {
    path: 'register',
    component: RegistrationComponent,
    data: { breadcrumb: 'Register' },
  },
  {
    path: 'confirm-email',
    component: ConfirmEmailComponent,
    data: { breadcrumb: 'Confirm Email' },
  },
  {
    path: 'send-email/:mode',
    component: SendEmailComponent,
    data: { breadcrumb: 'Send Email' },
  },
];
