import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtTokenService } from '../services/jwt-token.service';
import { UserService } from '../../user/services/user.service';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '../enums/notification-type.enum';
import { MESSAGES } from '../constants/messages';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const jwtTokenService = inject(JwtTokenService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  const accessToken = userService.getAccessToken();
  const refreshToken = userService.getRefreshToken();

  console.log('auth guard', accessToken, refreshToken);

  if (accessToken && !jwtTokenService.isTokenExpired(accessToken)) {
    return true;
  }

  if (refreshToken) {
    return userService.refreshAccessToken(refreshToken).pipe(
      map((success) => {
        console.log('refresh process', success);

        if (success) {
          return true;
        } else {
          notificationService.showNotification(
            NotificationType.warning,
            MESSAGES.user.notifications.warning.loginFailed
          );
          router.navigate(['/user/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }
      }),
      catchError(() => {
        // Handle refresh errors
        notificationService.showNotification(
          NotificationType.warning,
          MESSAGES.user.notifications.warning.loginFailed
        );
        router.navigate(['/user/login'], {
          queryParams: { returnUrl: state.url },
        });
        return of(false); // Deny navigation
      })
    );
  }

  notificationService.showNotification(
    NotificationType.warning,
    MESSAGES.user.notifications.warning.loginFailed
  );
  router.navigate(['/user/login'], {
    queryParams: { returnUrl: state.url },
  });

  console.log('returning false at auth guard');

  return false;
};
