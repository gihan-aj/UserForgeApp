import { Router, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { CategoryResolver } from './products/category-configuration/category.resolver';
import { authGuard } from './shared/guards/auth.guard';
import { UserManagementComponent } from './user-management/user-management.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { breadcrumb: '' },
    canActivate: [authGuard],
  },
  // {
  //   path: 'products',
  //   providers: [Router],
  //   loadChildren: () =>
  //     import('./products/products.routes').then((m) => m.routes),
  //   data: { breadcrumb: 'Products' },
  //   canActivate: [authGuard],
  // },
  // {
  //   path: 'account',
  //   providers: [Router],
  //   loadChildren: () =>
  //     import('./account/account.routes').then((m) => m.routes),
  // },
  {
    path: 'user',
    providers: [Router],
    loadChildren: () => import('./user/user.routes').then((u) => u.routes),
  },
  {
    path: 'user-management',
    providers: [Router],
    loadChildren: () =>
      import('./user-management/user-management.routes').then((u) => u.routes),
    data: { breadcrumb: 'user management' },
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { breadcrumb: 'not Found' },
  },
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full',
    data: { breadcrumb: 'not Found' },
  },
];
