import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ParcelService {
  constructor(private http: HttpClient) {}

  getMyParcels(): Promise<{ sent: any[]; received: any[] }> {
    return firstValueFrom(this.http.get<any>(`${API}/parcels/my`));
  }

  getAllParcels(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${API}/parcels`));
  }

  createParcel(data: any): Promise<any> {
    return firstValueFrom(this.http.post<any>(`${API}/parcels/create`, data));
  }

  updateStatus(parcelId: string, status: string): Promise<any> {
    return firstValueFrom(this.http.patch(`${API}/parcels/update-status`, {
      parcelId,
      status
    }));
  }

  getParcelById(id: string): Promise<any> {
    return firstValueFrom(this.http.get<any>(`${API}/parcels/${id}`));
  }
}
