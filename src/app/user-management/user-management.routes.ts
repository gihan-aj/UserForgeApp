import { Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { UserManagementComponent } from './user-management.component';

export const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { breadcrumb: 'users' },
  },
];
