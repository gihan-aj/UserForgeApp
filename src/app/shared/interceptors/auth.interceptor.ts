import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { UserService } from '../../user/services/user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const accessToken = userService.getAccessToken();
  const refreshToken = userService.getRefreshToken();

  if (accessToken && refreshToken) {
    req = userService.addToken(req, accessToken);
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 && refreshToken) {
        console.log('unauthorized request');

        return userService.refreshAccessToken(refreshToken).pipe(
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
