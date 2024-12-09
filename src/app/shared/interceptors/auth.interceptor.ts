import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.currentUserSig();
  const refreshToken = authService.getRefreshToken();

  if (user && refreshToken) {
    const accessToken = user.accessToken;
    if (accessToken) {
      req = authService.addToken(req, accessToken);
    }
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && refreshToken) {
        authService.refreshAccessToken(refreshToken).pipe(
          switchMap((response) => {
            const newAccessToken = response.accessToken;
            return next(authService.addToken(req, newAccessToken));
          }),
          catchError((error) => {
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
