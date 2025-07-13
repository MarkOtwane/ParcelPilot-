import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:3000/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  async getMyProfile(): Promise<any> {
    return firstValueFrom(this.http.get(`${API}/me`));
  }

  async updateProfile(data: any): Promise<any> {
    return firstValueFrom(this.http.patch(`${API}/update`, data));
  }

  async changePassword(data: any): Promise<any> {
    return firstValueFrom(this.http.patch(`${API}/change-password`, data));
  }

  async deactivateAccount(): Promise<any> {
    return firstValueFrom(this.http.delete(`${API}/deactivate`));
  }

  async getAllUsers(): Promise<any> {
    return firstValueFrom(this.http.get(`${API}`));
  }
}
