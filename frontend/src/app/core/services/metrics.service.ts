import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:3000/metrics';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  constructor(private http: HttpClient) {}

  async getMetrics(): Promise<any> {
    return firstValueFrom(this.http.get(`${API}`));
  }
}
