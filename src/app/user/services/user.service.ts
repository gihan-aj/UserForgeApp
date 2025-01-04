import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { LoginRequest } from '../models/login-request.model';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { MessageService } from '../../shared/services/message.service';
import { Router } from '@angular/router';
import { REFRESH_TOKEN } from '../../shared/constants/refresh-token';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { NotificationService } from '../../shared/services/notification.service';
import { ConfirmationService } from '../../shared/services/confirmation.service';
import { RegsitrationRequest } from '../models/registration-request';
import { ResetPasswordRequest } from '../models/reset-password-request';
import { User } from '../models/user.model';
import { UserInterface } from '../models/user.interface';
import { EditUserDetailsRequest } from '../models/edit-user-details-request.interface';
import { DeviceIdentifierService } from '../../shared/services/device-identifier.service';
import { LoginUser } from '../models/login-user.interface';
import { RefreshRequest } from '../models/refresh-request.interface';
import { UserSettings } from '../models/user-settings.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = `${environment.baseUrl}/user`;

  private userSubject = new BehaviorSubject<User | null>(null);
  private accessTokenSubject = new BehaviorSubject<string | null>(null);

  user$ = this.userSubject.asObservable();
  accessToken$ = this.accessTokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private deviceIdentifier: DeviceIdentifierService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  setUser(user: User) {
    this.userSubject.next(user);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  setAccessToken(token: string): void {
    this.accessTokenSubject.next(token);
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  updateAdditionalUserDetails(updater: (user: User) => void): void {
    const currentUser = this.userSubject.value;
    if (currentUser) {
      updater(currentUser);
      this.userSubject.next(currentUser);
    }
  }

  clearUser(): void {
    this.userSubject.next(null);
    this.accessTokenSubject.next(null);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  login(request: LoginUser): Observable<void> {
    const url = `${this.baseUrl}/login`;
    const deviceIdentifier =
      this.deviceIdentifier.getOrCreateDeviceIdentifier();

    const body: LoginRequest = {
      email: request.email,
      password: request.password,
      deviceIdentifier: deviceIdentifier,
    };

    return this.http.post<LoginResponse>(url, body).pipe(
      map((response) => {
        if (response) {
          let user = new User(
            response.user.id,
            response.user.firstName,
            response.user.lastName
          );

          user.roles = response.user.roles;
          user.userSettings = response.userSettings;

          this.setUser(user);
          this.setAccessToken(response.accessToken);
          this.setRefreshToken(response.refreshToken);

          const message = this.messageService.getMassage(
            'user.notifications.success.loggedIn',
            { firstName: user.firstName, lastName: user.lastName }
          );
          this.notificationService.showNotification(
            NotificationType.success,
            message
          );
        }
      })
    );
  }

  logout() {
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
            this.logoutFromServer().subscribe({
              next: () => {
                this.clearUser();
                this.router.navigateByUrl('/user/login');
              },
              error: (error) => {
                console.log('logout error', error);
                this.clearUser();
                this.router.navigateByUrl('/user/login');
              },
            });
            // this.clearUser();
            // this.router.navigateByUrl('/user/login');
          }
        },
      });
  }

  refreshAccessToken(refreshToken: string): Observable<any> {
    const url = this.baseUrl + '/refresh';
    const body: RefreshRequest = {
      refreshToken: refreshToken,
      deviceIdentifier: this.deviceIdentifier.getOrCreateDeviceIdentifier(),
    };

    console.log('refresh request body, ', body);

    return this.http.post<any>(url, body).pipe(
      tap((response) => {
        console.log(response);

        this.setAccessToken(response.accessToken);
        this.setRefreshToken(response.refreshToken);

        let newUser = new User(
          response.user.id,
          response.user.firstName,
          response.user.lastName
        );

        newUser.roles = response.user.roles;
        newUser.userSettings = response.userSettings;

        this.setUser(newUser);
      }),
      catchError((error) => {
        console.log('catch error', error);
        this.logoutFromServer().subscribe();
        this.clearUser();
        this.router.navigateByUrl('user/login');

        return throwError(() => error);
      })
    );
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Registraion
  public register(
    request: RegsitrationRequest
  ): Observable<{ message: string }> {
    const url = `${this.baseUrl}/register`;
    console.log('request', request);

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
  public sendPassowrdResetLink(email: string): Observable<void> {
    const url = `${this.baseUrl}/send-password-reset-link`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append('email', email);

    return this.http.post<void>(url, {}, { params: queryParams });
  }

  // Reset password
  public resetPassword(request: ResetPasswordRequest): Observable<void> {
    const url = `${this.baseUrl}/reset-password`;

    return this.http.put<void>(url, request, {});
  }

  // get user details
  public getUserDetails(): Observable<User> {
    const url = `${this.baseUrl}`;

    return this.http.get<UserInterface>(url).pipe(
      map((data) => {
        let user = this.userSubject.value;
        if (user && user.id === data.id) {
          user.updateEmail(data.email);
          user.firstName = data.firstName;
          user.lastName = data.lastName;
          user.phoneNumber = data.phoneNumber;
          // user.dateOfBirth = data.dateOfBirth
          //   ? new Date(data.dateOfBirth)
          //   : undefined;
          user.dateOfBirth = data.dateOfBirth;

          this.setUser(user);
        } else {
          let newUser = new User(data.id, data.firstName, data.lastName);

          newUser.updateEmail(data.email);
          newUser.firstName = data.firstName;
          newUser.lastName = data.lastName;
          newUser.phoneNumber = data.phoneNumber;
          // newUser.dateOfBirth = data.dateOfBirth
          //   ? new Date(data.dateOfBirth)
          //   : undefined;
          newUser.dateOfBirth = data.dateOfBirth;

          this.setUser(newUser);
        }
        return user!;
      })
    );
  }

  // Update user details
  public updateUserDetails(request: EditUserDetailsRequest): Observable<void> {
    const url = `${this.baseUrl}/update-user`;

    return this.http.put<void>(url, request, {});
  }

  // logout from server
  public logoutFromServer() {
    const url = `${this.baseUrl}/logout`;
    const body = {
      deviceIdentifier: this.deviceIdentifier.getOrCreateDeviceIdentifier(),
    };

    return this.http.put<void>(url, body, {});
  }

  // Get user settings
  public getUserSettings(): Observable<UserSettings> {
    const url = `${this.baseUrl}/user-settings`;

    return this.http.get<UserSettings>(url);
  }

  // update user settings
  public updateUserSettings(settings: UserSettings): Observable<void> {
    const url = `${this.baseUrl}/update-user-settings`;

    return this.http.put<void>(url, settings, {});
  }
}
