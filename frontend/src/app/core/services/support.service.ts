import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:3000/support';

@Injectable({ providedIn: 'root' })
export class SupportService {
  constructor(private http: HttpClient) {}

  async createTicket(data: any): Promise<any> {
    return firstValueFrom(this.http.post(`${API}`, data));
  }

  async getAllTickets(): Promise<any> {
    return firstValueFrom(this.http.get(`${API}`));
  }

  async respondToTicket(ticketId: string, response: string): Promise<any> {
    return firstValueFrom(this.http.post(`${API}/respond`, { ticketId, response }));
  }
}
