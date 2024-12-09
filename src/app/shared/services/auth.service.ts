import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  ACCESS_TOKEN,
  FIRST_NAME,
  LAST_NAME,
  REFRESH_TOKEN,
  USER_ID,
} from '../constants';
import { UserProfileInterface } from '../../account/user-profile.interface';
import { environment } from '../../../environments/environment.development';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { SnackBarService } from './snack-bar.service';
import { AlertTypeEnum } from '../enums/alert-type.enum';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSig = signal<UserProfileInterface | undefined | null>(undefined);

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: SnackBarService,
    private dialogService: DialogService
  ) {}

  private baseUrl: string = `${environment.baseUrl}/user`;

  login(credentials: UserProfileInterface) {
    this.currentUserSig.set(credentials);
    localStorage.setItem(REFRESH_TOKEN, credentials.refreshToken);

    this.snackBar.showNotification(
      AlertTypeEnum.success,
      `${credentials.lastName} has logged in.`
    );
  }

  logout() {
    this.dialogService
      .openDilaog(
        AlertTypeEnum.danger,
        'Logout Confirmation',
        `Are you sure you want to log out ?`,
        'Yes'
      )
      .afterClosed()
      .subscribe({
        next: (accepted) => {
          if (accepted) {
            this.currentUserSig.set(null);
            localStorage.clear();
            this.router.navigateByUrl('account/login');
          }
        },
      });
  }

  refreshAccessToken(refreshToken: string): Observable<any> {
    const url = this.baseUrl + '/refresh';
    return this.http.post<any>(url, { refreshToken: refreshToken }).pipe(
      tap((response) => {
        this.currentUserSig.set(response);
        localStorage.setItem(REFRESH_TOKEN, response.refreshToken);
      }),
      catchError((error) => {
        console.error('Error refreshing access token:', error);

        this.currentUserSig.set(null);
        localStorage.clear();
        this.router.navigateByUrl('account/login');

        return throwError(() => error);
      })
    );
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  handleTokenExpired(
    refreshToken: string,
    req: HttpRequest<any>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<any>> {
    return this.refreshAccessToken(refreshToken).pipe(
      switchMap(() => {
        const newAccessToken = this.currentUserSig()?.accessToken;
        return next(this.addToken(req, newAccessToken!));
      }),
      catchError((error) => {
        console.error('Error handling expired access token:', error);
        return throwError(() => error);
      })
    );
  }

  // refreshToken() {
  //   const url = `${this.baseUrl}/refresh`;

  //   return this.http.post<UserProfileInterface>(url, {}).pipe(
  //     map((response) => {
  //       const currentUser = this.currentUserSig();
  //       if (currentUser) {
  //         currentUser.accessToken = response.accessToken;
  //         this.currentUserSig.set(currentUser);
  //       }
  //       return response.accessToken;
  //     }),
  //     catchError((error) => {
  //       this.snackBar.showNotification(
  //         AlertTypeEnum.danger,
  //         `Refresh user failed. Please log in again`
  //       );
  //       this.logout();
  //       throw error;
  //     })
  //   );
  // }
  // // refreshToken() {
  // //   const url = `${this.baseUrl}/refresh`;

  // //   return this.http.post<UserProfileInterface>(url, {}).pipe(
  // //     map((response) => {
  // //       const currentUser = this.currentUserSig();
  // //       if (currentUser) {
  // //         currentUser.accessToken = response.accessToken;
  // //         this.currentUserSig.set(currentUser);
  // //       }

  // //       return true;
  // //     }),
  // //     catchError(this.handleError<UserProfileInterface>('Refresh user'))
  // //   );
  // // }

  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     // this.log(`${operation} failed: ${error.message}`);
  //     this.snackBar.showNotification(
  //       AlertTypeEnum.danger,
  //       `${operation} failed.`
  //     );

  //     this.logout();
  //     // this.router.navigateByUrl('/account/login');

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }

  // login(user: UserProfileInterface): void {
  //   this.currentUserSig.set(user);
  //   // Persist non-sensitive data
  //   localStorage.setItem(USER_ID, user.id);
  //   localStorage.setItem(FIRST_NAME, this.capitalizeFirst(user.firstName));
  //   localStorage.setItem(LAST_NAME, this.capitalizeFirst(user.lastName));
  // }

  // isLoggedIn() {
  //   return localStorage.getItem(TOKEN_KEY) != null ? true : false;
  // }

  // getToken(): string | null {
  //   return localStorage.getItem(TOKEN_KEY);
  // }

  // logout(): void {
  //   this.currentUserSig.set(null);
  //   // Clear persisted data
  //   localStorage.clear();
  //   this.router.navigateByUrl('/account/login');
  // }

  // private capitalizeFirst(value: string): string {
  //   return String(value)
  //     .replace(/([A-Z])/g, ' $1')
  //     .replace(/^./, (str) => str.toUpperCase());
  // }
}
