import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

import { environment } from '../../../../enviroment/environment';

const API = environment.apiUrl + '/users';

// const API = 'http://localhost:3000/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  async getMyProfile(): Promise<any> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<any>>(`${API}/me`)
    );
    return response.data;
  }

  async updateProfile(data: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.patch<ApiResponse<any>>(`${API}/update`, data)
    );
    return response.data;
  }

  async changePassword(data: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.patch<ApiResponse<any>>(`${API}/change-password`, data)
    );
    return response.data;
  }

  async deactivateAccount(): Promise<any> {
    const response = await firstValueFrom(
      this.http.delete<ApiResponse<any>>(`${API}/deactivate`)
    );
    return response.data;
  }

  async getAllUsers(): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<any[]>>(`${API}`)
    );
    return response.data;
  }

  async getUserById(id: string): Promise<any> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<any>>(`${API}/${id}`)
    );
    return response.data;
  }

  async updateUser(id: string, data: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.patch<ApiResponse<any>>(`${API}/${id}`, data)
    );
    return response.data;
  }

  async deleteUser(id: string): Promise<any> {
    const response = await firstValueFrom(
      this.http.delete<ApiResponse<any>>(`${API}/${id}`)
    );
    return response.data;
  }
}
