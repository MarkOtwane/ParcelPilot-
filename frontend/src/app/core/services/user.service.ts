import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API = 'http://localhost:3000/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getMyProfile(): Promise<any> {
    return this.http.get(`${API}/me`).toPromise();
  }

  updateProfile(data: { name: string; phone: string }): Promise<any> {
    return this.http.patch(`${API}/update`, data).toPromise();
  }

  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<any> {
    return this.http.patch(`${API}/change-password`, data).toPromise();
  }
  getAllUsers(): Promise<any[]> {
    return this.http.get<any[]>('http://localhost:3000/users').toPromise();
  }

  deactivateUser(userId: string): Promise<void> {
    return this.http
      .delete<void>(`http://localhost:3000/users/deactivate/${userId}`)
      .toPromise();
  }
}
