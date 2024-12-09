import { Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';

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
  public auth = inject(AuthService);

  closeSidemenu = output<boolean>();

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
    if (window.innerWidth < 768) {
      this.closeSidemenu.emit(true);
    }
  }

  onLogout() {
    this.auth.logout();
    this.menuItemClicked();
  }
}
