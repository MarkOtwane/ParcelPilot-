import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:3000/metrics';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  constructor(private http: HttpClient) {}

  getDashboardStats(): Promise<any> {
    return this.http.get<any>(API).toPromise();
  }
  getDashboardStats(): Promise<any> {
    return this.http.get<any>('http://localhost:3000/metrics').toPromise();
  }
}
