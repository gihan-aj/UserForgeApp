import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

const MENU_ITEMS = [
  {
    name: 'Users',
    icon: 'people',
    route: 'users',
  },
  {
    name: 'Roles',
    icon: 'assignment_ind',
    route: 'roles',
  },
  {
    name: 'Permissions',
    icon: 'lock',
    route: 'permissions',
  },
];

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  items = MENU_ITEMS;
}
