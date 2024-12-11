import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SnackBarService } from '../services/snack-bar.service';
import { AlertType } from '../enums/alert-type.enum';
import { JwtTokenService } from '../services/jwt-token.service';
import { UserService } from '../../user/services/user.service';
import { MessageService } from '../services/message.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const jwtTokenService = inject(JwtTokenService);
  const router = inject(Router);
  const snackBar = inject(SnackBarService);
  const messageService = inject(MessageService);

  if (userService.currentUserSig()) {
    const accessToken = userService.getAccessToken();
    if (accessToken) {
      if (!jwtTokenService.isTokenExpired(accessToken)) {
        return true;
      }

      console.log('jwt has expired.');
    } else {
      userService.clearSession();

      const message = messageService.getMassage(
        'user',
        'notifications',
        'danger',
        'loginFailed'
      );

      snackBar.showNotification(AlertType.danger, message);

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

        const message = messageService.getMassage(
          'user',
          'notifications',
          'danger',
          'loginFailed'
        );

        snackBar.showNotification(AlertType.danger, message);

        router.navigate(['/user/login'], {
          queryParams: { returnUrl: state.url },
        });
      },
    });
  } else {
    const message = messageService.getMassage(
      'user',
      'notifications',
      'warning',
      'loginFailed'
    );
    snackBar.showNotification(AlertType.warning, message);

    router.navigate(['/user/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return false;
};
