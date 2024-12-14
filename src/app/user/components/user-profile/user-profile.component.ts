import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationType } from '../../../shared/enums/notification-type.enum';
import { MESSAGES } from '../../../shared/constants/messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatDivider,
    MatListModule,
    MatIconModule,
    DatePipe,
    MatButtonModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  user: User | undefined;

  constructor(
    public userService: UserService,
    private errorHandling: ErrorHandlingService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        this.errorHandling.handle(error);

        this.notificationService.showNotification(
          NotificationType.danger,
          MESSAGES.user.notifications.danger.userProfileRetrievalFailed
        );

        this.userService.clearSession();
        this.router.navigateByUrl('/user/login');
      },
    });
  }

  editProfile() {
    throw new Error('Method not implemented.');
  }
}
