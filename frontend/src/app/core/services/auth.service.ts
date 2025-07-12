import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API = 'http://localhost:3000/auth'; // Adjust as needed

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<any> {
    const res = await this.http
      .post<{ access_token: string }>(`${API}/login`, { email, password })
      .toPromise();

    const payload = this.decodeJwt(res.access_token);
    localStorage.setItem('access_token', res.access_token);
    return { ...payload, token: res.access_token };
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  decodeJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<any> {
    const res = await this.http
      .post<{ access_token: string }>(`${API}/register`, data)
      .toPromise();

    const payload = this.decodeJwt(res.access_token);
    localStorage.setItem('access_token', res.access_token);
    return { ...payload, token: res.access_token };
  }

  async requestResetPassword(email: string): Promise<void> {
    await this.http
      .post('http://localhost:3000/auth/reset-password-request', { email })
      .toPromise();
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.http
      .post('http://localhost:3000/auth/update-password', {
        token,
        newPassword,
      })
      .toPromise();
  }
}
