import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequestInterface } from './login/login-request.interface';
import { map, Observable } from 'rxjs';
import { UserProfileInterface } from './user-profile.interface';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private baseUrl: string = `${environment.baseUrl}/user`;

  login(request: LoginRequestInterface): Observable<void> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<UserProfileInterface>(url, request).pipe(
      map((user: UserProfileInterface) => {
        if(user){
          this.authService.login(user);
        }
      })
    );
  }

  register(formData: any): Observable<any> {
    const url = `${this.baseUrl}/register`;
    return this.http.post(url, formData);
  }

  activateAccount(userId: string, token: string): Observable<any> {
    const url = `${this.baseUrl}/confirm-email`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append('userId', userId);
    queryParams = queryParams.append('token', token);

    return this.http.put(url, null, { params: queryParams });
  }

  resendActivationLink(email: string): Observable<any> {
    const url = `${this.baseUrl}/resend-email-confirmation-link/${email}`;
    return this.http.post(url, null);
  }

  getUserProfile() {
    return this.http.get<UserProfileInterface>(this.baseUrl);
  }
}
