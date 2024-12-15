import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/models/user.model';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: 'top-bar.component.scss',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('in => out', [animate('300ms ease-out')]),
      transition('out => in', [animate('300ms ease-in')]),
    ]),
  ],
})
export class TopBarComponent {
  userService = inject(UserService);

  darkMode = signal<boolean>(true);

  sideNavbarOpened = input.required<boolean>();

  changeSideNavbarOpened = output<boolean>();

  user: User | null | undefined;

  userInitials: string | undefined;

  // userDisplayText = computed(() => {
  //   if (this.userService.currentUserSig()) {
  //     return (
  //       this.userService.currentUserSig()!.firstName[0].toUpperCase() +
  //       this.userService.currentUserSig()!.lastName[0].toUpperCase()
  //     );
  //   } else {
  //     return 'person';
  //   }
  // });

  // isUserLoggedIn = computed(() =>
  //   this.userService.currentUserSig() ? true : false
  // );

  constructor() {
    this.userService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.userInitials = user?.initials;
        } else {
          this.user = null;
          this.userInitials = undefined;
        }
      },
    });
  }

  onLogout() {
    this.userService.logout();
  }

  toggleSideNavbar(): void {
    this.changeSideNavbarOpened.emit(!this.sideNavbarOpened());
  }

  setDarkMode = effect(() => {
    document.documentElement.classList.toggle('dark', this.darkMode());
    document.documentElement.classList.toggle('light', !this.darkMode());
  });
}
