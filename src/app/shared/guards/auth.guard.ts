import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';
import { AlertTypeEnum } from '../enums/alert-type.enum';
import { JwtTokenService } from '../services/jwt-token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const jwtTokenService = inject(JwtTokenService);
  const router = inject(Router);
  const snackBar = inject(SnackBarService);

  if (authService.currentUserSig()) {
    const accessToken = authService.currentUserSig()?.accessToken;
    if (accessToken) {
      if (!jwtTokenService.isTokenExpired(accessToken)) {
        console.log('jwt has not expired');
        return true;
      } else {
        console.log('jwt has expired');
      }
    } else {
      authService.logout();

      snackBar.showNotification(
        AlertTypeEnum.danger,
        'Access denied. You have to login again'
      );

      router.navigate(['/account/login'], {
        queryParams: { returnUrl: state.url },
      });

      return false;
    }
  }

  const refreshToken = authService.getRefreshToken();
  if (refreshToken) {
    authService.refreshAccessToken(refreshToken).subscribe({
      next: () => {
        console.log('token verified.');

        router.navigateByUrl(state.url);

        return true;
      },
      error: (error) => {
        console.error(error);

        snackBar.showNotification(
          AlertTypeEnum.danger,
          'You have to login again'
        );

        router.navigate(['/account/login'], {
          queryParams: { returnUrl: state.url },
        });
      },
    });
  } else {
    snackBar.showNotification(AlertTypeEnum.warning, 'You have to login first');

    router.navigate(['/account/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return false;
};
