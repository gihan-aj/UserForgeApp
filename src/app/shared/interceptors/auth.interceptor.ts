import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
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

  return next(req);

  // return next(req).pipe(
  //   catchError((error) => {
  //     if (error.status === 401 && refreshToken) {
  //       return authService.handleTokenExpired(refreshToken, req, next);
  //     }

  //     return throwError(() => error);
  //   })
  // );
};
