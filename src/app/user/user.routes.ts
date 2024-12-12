import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from '../shared/guards/login.guard';
import { RegistrationComponent } from './components/registration/registration.component';

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
];
