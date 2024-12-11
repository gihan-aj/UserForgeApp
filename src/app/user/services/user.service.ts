import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { LoginRequest } from '../models/login-request.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { UserResponse } from '../models/user-response.model';
import { REFRESH_TOKEN } from '../../shared/constants';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { DialogService } from '../../shared/services/dialog.service';
import { MessageService } from '../../shared/services/message.service';
import { AlertType } from '../../shared/enums/alert-type.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = `${environment.baseUrl}/user`;

  private accessToken: string | null | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: SnackBarService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  public currentUserSig = signal<UserResponse | null | undefined>(undefined);

  public login(request: LoginRequest): Observable<void> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<LoginResponse>(url, request).pipe(
      map((response) => {
        if (response) {
          this.persistUserAndTokens(response);

          const message = this.messageService.getMassage(
            'user',
            'notifications',
            'success',
            'loggedIn',
            { lastName: response.user.lastName }
          );
          this.snackBar.showNotification(AlertType.success, message);
        }
      })
    );
  }

  public getAccessToken(): string | null | undefined {
    return this.accessToken;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  public clearSession(): void {
    this.currentUserSig.set(null);
    this.accessToken = null;
    localStorage.removeItem(REFRESH_TOKEN);
  }

  public logout() {
    const title = this.messageService.getMassage(
      'user',
      'alerts',
      'titles',
      'logout'
    );

    const message = this.messageService.getMassage(
      'user',
      'alerts',
      'messages',
      'logout'
    );

    const action = this.messageService.getMassage(
      'user',
      'alerts',
      'actions',
      'logout'
    );

    this.dialogService
      .openDilaog(AlertType.danger, title, message, action)
      .afterClosed()
      .subscribe({
        next: (accepted) => {
          if (accepted) {
            this.clearSession();
            this.router.navigateByUrl('user/login');
          }
        },
      });
  }

  public refreshAccessToken(refreshToken: string): Observable<any> {
    const url = this.baseUrl + '/refresh';
    return this.http.post<any>(url, { refreshToken: refreshToken }).pipe(
      tap((response) => {
        this.persistUserAndTokens(response);

        console.log('refreshing access token:', response.user);
      }),
      catchError((error) => {
        console.error('Error refreshing access token:', error);

        this.clearSession();
        this.router.navigateByUrl('user/login');

        return throwError(() => error);
      })
    );
  }

  public addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private setRefresToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  private persistUserAndTokens(response: LoginResponse) {
    this.currentUserSig.set(response.user);
    this.setAccessToken(response.accessToken);
    this.setRefresToken(response.refreshToken);
  }
}
