import { Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/models/user.model';
import { LARGE_SCREEN_LOWER_LIMIT } from '../../shared/constants/screen-sizes';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
})
export class SidenavComponent {
  public userService = inject(UserService);

  closeSidemenu = output<boolean>();

  user: User | null | undefined;

  constructor() {
    this.userService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }
      },
    });
  }

  menuItems = [
    {
      routerLink: 'dashboard',
      icon: 'dashboard',
      label: 'Dashboard',
    },
    {
      routerLink: 'user-management',
      icon: 'groups',
      label: 'User Management',
    },
    {
      routerLink: 'software-packages',
      icon: 'app_shortcut',
      label: 'Software Packages',
    },
    {
      routerLink: 'permissions-management',
      icon: 'admin_panel_settings',
      label: 'Permissions Management',
    },
    {
      routerLink: 'audit-logs',
      icon: 'summarize',
      label: 'Audit Logs',
    },
    {
      routerLink: 'sso-settings',
      icon: 'manufacturing',
      label: 'SSO Settings',
    },
    {
      routerLink: 'intergrations',
      icon: 'api',
      label: 'Intergrations',
    },
    {
      routerLink: 'support',
      icon: 'help',
      label: 'Support',
    },
    {
      routerLink: 'settings',
      icon: 'settings',
      label: 'Settings',
    },
  ];

  menuItemClicked() {
    if (window.innerWidth < LARGE_SCREEN_LOWER_LIMIT) {
      this.closeSidemenu.emit(true);
    }
  }

  onLogout() {
    this.userService.logout();
    this.menuItemClicked();
  }
}
