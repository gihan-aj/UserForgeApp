import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {
  jwtToken: string = '';
  decodedToken: { [key: string]: string } = {};

  constructor() {}

  setToken(token: string) {
    if (token) {
      this.jwtToken = token;
    }
  }

  decodeToken() {
    if (this.jwtToken && this.jwtToken.length > 0) {
      this.decodedToken = jwtDecode(this.jwtToken);
    }
  }

  getDecodedToken(token: string) {
    this.setToken(token);
    return jwtDecode(this.jwtToken);
  }

  getUserId(token: string) {
    this.setToken(token);
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['nameid'] : null;
  }

  getEmail(token: string) {
    this.setToken(token);
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['email'] : null;
  }

  getExpiryTime(token: string) {
    this.setToken(token);
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['exp'] : null;
  }

  isTokenExpired(token: string): boolean {
    const expiryTime: string | null = this.getExpiryTime(token);
    if (expiryTime) {
      return Number(expiryTime) * 1000 - new Date().getTime() < 5000;
    } else {
      return true;
    }
  }
}
