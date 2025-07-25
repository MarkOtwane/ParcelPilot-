import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

import { environment } from '../../../../enviroment/environment';

const API = environment.apiUrl + '/metrics';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  constructor(private http: HttpClient) {}

  async getMetrics(): Promise<any> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<any>>(`${API}`)
    );
    return response.data;
  }
}
