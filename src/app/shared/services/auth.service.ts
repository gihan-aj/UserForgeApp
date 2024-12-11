import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { REFRESH_TOKEN } from '../constants';
import { UserProfileInterface } from '../../account/user-profile.interface';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { SnackBarService } from './snack-bar.service';
import { AlertType } from '../enums/alert-type.enum';
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
      AlertType.success,
      `${credentials.lastName} has logged in.`
    );
  }

  logout() {
    this.dialogService
      .openDilaog(
        AlertType.danger,
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
            this.router.navigateByUrl('user/login');
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
        this.router.navigateByUrl('user/login');

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

  // private capitalizeFirst(value: string): string {
  //   return String(value)
  //     .replace(/([A-Z])/g, ' $1')
  //     .replace(/^./, (str) => str.toUpperCase());
  // }
}
