import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { OutletContext, RouterOutlet } from '@angular/router';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { FooterComponent } from './layout/footer/footer.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from './shared/components/breadcrumb/breadcrumb.service';
import { routerFadeIn } from './shared/animations/router-fade-in.animation';
import { DeviceIdentifierService } from './shared/services/device-identifier.service';
import { LARGE_SCREEN_LOWER_LIMIT } from './shared/constants/screen-sizes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TopBarComponent,
    SidenavComponent,
    FooterComponent,
    BreadcrumbComponent,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [routerFadeIn],
})
export class AppComponent implements OnInit {
  title = 'userforge-app';
  screenWidth = signal<number>(window.innerWidth);
  sideNavbarOpened = signal<boolean>(true);
  sideNavBarMode = signal<'over' | 'push' | 'side'>('side');

  constructor(
    public breadcrumbService: BreadcrumbService,
    private deviceIdentifier: DeviceIdentifierService
  ) {}

  ngOnInit(): void {
    this.sideNavbarOpened.set(this.screenWidth() > LARGE_SCREEN_LOWER_LIMIT);
    this.deviceIdentifier.getOrCreateDeviceIdentifier();
  }

  changeSideNavbarOpened($event: boolean) {
    this.sideNavbarOpened.set($event);
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < LARGE_SCREEN_LOWER_LIMIT) {
      this.sideNavbarOpened.set(false);
      this.sideNavBarMode.set('over');
    } else {
      this.sideNavbarOpened.set(true);
      this.sideNavBarMode.set('side');
    }
  }
}
