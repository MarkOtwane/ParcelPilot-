import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:3000/payments';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

  async initiatePayment(data: any): Promise<any> {
    return firstValueFrom(this.http.post(`${API}/initiate`, data));
  }

  async getMyPayments(): Promise<any> {
    return firstValueFrom(this.http.get(`${API}/my`));
  }

  async getAllPayments(): Promise<any> {
    return firstValueFrom(this.http.get(`${API}`));
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<any> {
    return firstValueFrom(
      this.http.patch(`${API}/update-status`, { paymentId, status })
    );
  }
}
