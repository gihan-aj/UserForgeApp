import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../enums/notification-type.enum';
import { MESSAGES } from '../constants/messages';
import { UserService } from '../../user/services/user.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (userService.currentUserSig()) {
    notificationService.showNotification(
      NotificationType.info,
      MESSAGES.user.notifications.info.alreadyLoggedIn
    );

    router.navigateByUrl('/dashboard');
    return false;
  } else {
    return true;
  }
};
