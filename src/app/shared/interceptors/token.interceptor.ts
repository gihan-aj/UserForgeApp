import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  authService = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          });
        }
      },
    });

    return next.handle(req);
  }
}
