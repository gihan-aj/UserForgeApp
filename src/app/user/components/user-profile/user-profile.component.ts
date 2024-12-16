import { Component, inject, OnInit } from '@angular/core';
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
import { UserInterface } from '../../models/user.interface';
import { EditUserDetails } from '../../models/edit-user-details.interface';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDetailsDialogComponent } from './edit-user-details-dialog/edit-user-details-dialog.component';

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
  readonly dialog = inject(MatDialog);

  user: User | undefined;

  constructor(
    public userService: UserService,
    private errorHandling: ErrorHandlingService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  private getUserDetails() {
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        this.user = response;
        console.log('When retrieve: ', response.dateOfBirth);
      },
      error: (error) => {
        this.errorHandling.handle(error);

        this.notificationService.showNotification(
          NotificationType.danger,
          MESSAGES.user.notifications.danger.userProfileRetrievalFailed
        );

        this.userService.clearUser();
        this.router.navigateByUrl('/user/login');
      },
    });
  }

  editProfile() {
    const data: EditUserDetails = {
      email: this.user?.email!,
      firstName: this.user?.firstName!,
      lastName: this.user?.lastName!,
      phoneNumber: this.user?.phoneNumber,
      dateOfBirth: this.user?.dateOfBirth,
    };

    if (data.dateOfBirth) {
      const utcDate = new Date(
        Date.UTC(
          data.dateOfBirth.getFullYear(),
          data.dateOfBirth.getMonth(),
          data.dateOfBirth.getDate()
        )
      );

      data.dateOfBirth = utcDate;
    }

    const dialogRef = this.dialog.open(EditUserDetailsDialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe({
      next: (res: EditUserDetails) => {
        if (res) {
          console.log('Input: ', res.dateOfBirth);
          this.userService.updateUserDetails(res).subscribe({
            next: () => {
              this.notificationService.showNotification(
                NotificationType.success,
                MESSAGES.user.notifications.success.userUpdated
              );

              this.getUserDetails();
            },
            error: (error) => {
              this.errorHandling.handle(error);
            },
          });
        } else {
          this.notificationService.showNotification(
            NotificationType.danger,
            MESSAGES.user.notifications.danger.userUpdateFailed
          );
        }
      },
    });
  }
}
