import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:3000/auth'; // Adjust as needed

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<any> {
    try {
      console.log('=== LOGIN ATTEMPT START ===');
      console.log('Attempting login for email:', email);

      const res = await firstValueFrom(
        this.http.post<any>(`${API}/login`, {
          email,
          password,
        })
      );

      console.log('=== LOGIN RESPONSE RECEIVED ===');
      console.log('Full response:', JSON.stringify(res, null, 2));

      if (!res) {
        throw new Error('Login failed - no response received');
      }

      // Handle nested response structure
      const responseData = res.data || res;
      console.log('=== RESPONSE DATA EXTRACTED ===');
      console.log('Response data:', JSON.stringify(responseData, null, 2));

      if (!responseData.access_token) {
        console.error('No access_token in response data:', responseData);
        throw new Error('Login failed - no access token received');
      }

      console.log('=== TOKEN EXTRACTION SUCCESS ===');
      console.log(
        'Access token received, length:',
        responseData.access_token.length
      );
      console.log(
        'Token preview:',
        responseData.access_token.substring(0, 50) + '...'
      );

      const payload = this.decodeJwt(responseData.access_token);

      if (!payload) {
        throw new Error('Login failed - invalid token received');
      }

      console.log('=== TOKEN STORAGE ===');
      localStorage.setItem('access_token', responseData.access_token);
      console.log('Token stored in localStorage successfully');

      const result = { ...payload, token: responseData.access_token };
      console.log('=== LOGIN SUCCESS ===');
      console.log('Returning result:', result);

      return result;
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Login error:', error);
      throw error;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  decodeJwt(token: string): any {
    try {
      if (!token) {
        console.error('Token is null or undefined');
        return null;
      }

      console.log('Decoding JWT token:', token.substring(0, 50) + '...');

      // Split the token into parts
      const parts = token.split('.');
      console.log('Token parts count:', parts.length);

      if (parts.length !== 3) {
        console.error(
          'Invalid JWT token format - expected 3 parts, got',
          parts.length
        );
        return null;
      }

      // Decode the payload (second part)
      const payload = parts[1];
      console.log('Raw payload:', payload);

      // Add padding if needed
      const paddedPayload =
        payload + '='.repeat((4 - (payload.length % 4)) % 4);
      console.log('Padded payload:', paddedPayload);

      // Decode using base64
      const decoded = decodeURIComponent(
        Array.prototype.map
          .call(
            atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/')),
            (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          )
          .join('')
      );

      console.log('Decoded payload string:', decoded);
      const result = JSON.parse(decoded);
      console.log('Final decoded payload:', result);
      return result;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
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
    try {
      const res = await firstValueFrom(
        this.http.post<any>(`${API}/register`, data)
      );

      if (!res) {
        throw new Error('Registration failed - no response received');
      }

      // Handle nested response structure
      const responseData = res.data || res;

      if (!responseData.access_token) {
        throw new Error('Registration failed - no access token received');
      }

      const payload = this.decodeJwt(responseData.access_token);
      localStorage.setItem('access_token', responseData.access_token);
      return { ...payload, token: responseData.access_token };
    } catch (error: any) {
      // Re-throw the error so the component can handle it
      throw error;
    }
  }

  async requestResetPassword(email: string): Promise<void> {
    await firstValueFrom(
      this.http.post('http://localhost:3000/auth/reset-password-request', {
        email,
      })
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await firstValueFrom(
      this.http.post('http://localhost:3000/auth/update-password', {
        token,
        newPassword,
      })
    );
  }
}
