import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { LoginRequest } from '../models/login-request.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { UserResponse } from '../models/user-response.model';
import { MessageService } from '../../shared/services/message.service';
import { Router } from '@angular/router';
import { REFRESH_TOKEN } from '../../shared/constants/refresh-token';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { NotificationService } from '../../shared/services/notification.service';
import { ConfirmationService } from '../../shared/services/confirmation.service';
import { RegsitrationRequest } from '../models/registration-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = `${environment.baseUrl}/user`;

  private accessToken: string | null | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public currentUserSig = signal<UserResponse | null | undefined>(undefined);

  public login(request: LoginRequest): Observable<void> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<LoginResponse>(url, request).pipe(
      map((response) => {
        if (response) {
          this.persistUserAndTokens(response);

          const firstName = this.capitalizeFirstLetter(response.user.firstName);
          const lastName = this.capitalizeFirstLetter(response.user.lastName);
          const message = this.messageService.getMassage(
            'user.notifications.success.loggedIn',
            { firstName: firstName, lastName: lastName }
          );

          this.notificationService.showNotification(
            NotificationType.success,
            message
          );
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
      'user.confirmations.titles.logout'
    );
    const message = this.messageService.getMassage(
      'user.confirmations.messages.logout'
    );
    const action = this.messageService.getMassage(
      'user.confirmations.actions.logout'
    );
    this.confirmationService
      .openConfirmationDialog(NotificationType.danger, title, message, action)
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

  private capitalizeFirstLetter(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Registraion
  public register(
    request: RegsitrationRequest
  ): Observable<{ message: string }> {
    const url = `${this.baseUrl}/register`;
    return this.http.post<{ message: string }>(url, request);
  }

  // Confirm email
  public confirmEmail(userId: string, token: string): Observable<void> {
    const url = `${this.baseUrl}/confirm-email`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append('userId', userId);
    queryParams = queryParams.append('token', token);

    return this.http.put<void>(url, null, { params: queryParams });
  }

  // Resend email confirmation link
  public resendEmailConfirmationLink(email: string): Observable<void> {
    const url = `${this.baseUrl}/resend-email-confirmation-link`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append('email', email);

    return this.http.post<void>(url, {}, { params: queryParams });
  }

  // Send passwaord change link
  public SendPassowrdResetLink(email: string): Observable<void> {
    const url = `${this.baseUrl}/send-password-reset-link`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append('email', email);

    return this.http.post<void>(url, {}, { params: queryParams });
  }
}
