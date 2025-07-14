import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResponse, ParcelsResponse } from '../models/api-response.model';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ParcelService {
  constructor(private http: HttpClient) {}

  async getMyParcels(): Promise<ParcelsResponse> {
    const response = await firstValueFrom(this.http.get<ApiResponse<ParcelsResponse>>(`${API}/parcels/my`));
    return response.data;
  }

  async getAllParcels(): Promise<any[]> {
    const response = await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${API}/parcels`));
    return response.data;
  }

  async createParcel(data: any): Promise<any> {
    const response = await firstValueFrom(this.http.post<ApiResponse<any>>(`${API}/parcels/create`, data));
    return response.data;
  }

  async updateStatus(parcelId: string, status: string): Promise<any> {
    const response = await firstValueFrom(this.http.patch<ApiResponse<any>>(`${API}/parcels/update-status`, {
      parcelId,
      status
    }));
    return response.data;
  }

  async getParcelById(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.get<ApiResponse<any>>(`${API}/parcels/${id}`));
    return response.data;
  }

  async deleteParcel(parcelId: string): Promise<any> {
    const response = await firstValueFrom(this.http.delete<ApiResponse<any>>(`${API}/parcels/${parcelId}`));
    return response.data;
  }

  async updateParcel(parcelId: string, data: any): Promise<any> {
    const response = await firstValueFrom(this.http.patch<ApiResponse<any>>(`${API}/parcels/${parcelId}`, data));
    return response.data;
  }
}
