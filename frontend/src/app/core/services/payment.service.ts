import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

import { environment } from '../../../../enviroment/environment'; 

const API = environment.apiUrl + '/payments';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

  async initiatePayment(data: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<any>>(`${API}/initiate`, data)
    );
    return response.data;
  }

  async getMyPayments(): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<any[]>>(`${API}/my`)
    );
    return response.data;
  }

  async getAllPayments(): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<any[]>>(`${API}`)
    );
    return response.data;
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<any> {
    const response = await firstValueFrom(
      this.http.patch<ApiResponse<any>>(`${API}/update-status`, {
        paymentId,
        status,
      })
    );
    return response.data;
  }
}
