import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtTokenService } from '../services/jwt-token.service';
import { UserService } from '../../user/services/user.service';
import { MessageService } from '../services/message.service';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../enums/notification-type.enum';
import { MESSAGES } from '../constants/messages';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const jwtTokenService = inject(JwtTokenService);
  const notificationService = inject(NotificationService);

  if (userService.getUser()) {
    const accessToken = userService.getAccessToken();
    if (accessToken) {
      if (!jwtTokenService.isTokenExpired(accessToken)) {
        return true;
      }
      console.log('jwt has expired.');
    } else {
      userService.clearUser();

      notificationService.showNotification(
        NotificationType.danger,
        MESSAGES.user.notifications.danger.loginFailed
      );

      router.navigate(['/user/login'], {
        queryParams: { returnUrl: state.url },
      });

      return false;
    }
  }

  const refreshToken = userService.getRefreshToken();
  if (refreshToken) {
    userService.refreshAccessToken(refreshToken).subscribe({
      next: () => {
        console.log('refreshAccessToken called: token verified.');

        router.navigateByUrl(state.url);

        return true;
      },
      error: (error) => {
        console.error(error);

        notificationService.showNotification(
          NotificationType.danger,
          MESSAGES.user.notifications.danger.loginFailed
        );

        router.navigate(['/user/login'], {
          queryParams: { returnUrl: state.url },
        });
      },
    });
  } else {
    notificationService.showNotification(
      NotificationType.warning,
      MESSAGES.user.notifications.warning.loginFailed
    );

    router.navigate(['/user/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return false;
};
