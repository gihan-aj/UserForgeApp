import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { UserService } from '../../user/services/user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const user = userService.currentUserSig();
  const refreshToken = userService.getRefreshToken();

  if (user && refreshToken) {
    const accessToken = userService.getAccessToken();
    if (accessToken) {
      req = userService.addToken(req, accessToken);
    }
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && refreshToken) {
        console.log('unauthorized request');

        userService.refreshAccessToken(refreshToken).pipe(
          switchMap((response) => {
            console.log('called refreshAccessToken');
            const newAccessToken = response.accessToken;
            return next(userService.addToken(req, newAccessToken));
          }),
          catchError((error) => {
            console.log('called refreshAccessToken: couldnt refresh');
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
