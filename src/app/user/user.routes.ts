import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from '../shared/guards/login.guard';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { breadcrumb: 'Login' },
    canActivate: [loginGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { breadcrumb: 'Register' },
  },
];
