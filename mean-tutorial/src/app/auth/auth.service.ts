import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private tokentimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData).subscribe(response => {
      const token = response.token;
      this.token = token;

      if (token) {
      const expiresInDuration = response.expiresIn;

      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresInDuration);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

      this.saveAuthData(token, expirationDate);
      this.router.navigate(['/']);
      }
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokentimer);
  }

  private setAuthTimer(duration: number) {
    this.tokentimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiratio');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate) {
      return;
    }

    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }
}

