import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:3000/support';

@Injectable({ providedIn: 'root' })
export class SupportService {
  constructor(private http: HttpClient) {}

  getAllTickets(): Promise<any[]> {
    return this.http.get<any[]>(API).toPromise();
  }

  respondToTicket(ticketId: string, response: string): Promise<any> {
    return this.http
      .patch(`${API}/respond`, { ticketId, response })
      .toPromise();
  }
}
