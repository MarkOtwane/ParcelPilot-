import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

import { environment } from '../../../../enviroment/environment';

const API = environment.apiUrl + '/support';

// const API = 'http://localhost:3000/support';

@Injectable({ providedIn: 'root' })
export class SupportService {
  constructor(private http: HttpClient) {}

  async createTicket(data: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<any>>(`${API}`, data)
    );
    return response.data;
  }

  async getAllTickets(): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<any[]>>(`${API}`)
    );
    return response.data;
  }

  async respondToTicket(ticketId: string, response: string): Promise<any> {
    const apiResponse = await firstValueFrom(
      this.http.post<ApiResponse<any>>(`${API}/respond`, { ticketId, response })
    );
    return apiResponse.data;
  }

  async getUserTickets(email: string): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<any[]>>(
        `${API}?email=${encodeURIComponent(email)}`
      )
    );
    return response.data;
  }
}
