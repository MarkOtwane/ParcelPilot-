import { Component, OnInit } from '@angular/core';
import { MetricsService } from 'src/app/core/services/metrics.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = true;

  stats = {
    users: 0,
    parcels: 0,
    completedParcels: 0,
    totalPayments: 0,
  };

  constructor(
    private metricsService: MetricsService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    try {
      this.stats = await this.metricsService.getDashboardStats();
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to load metrics.');
    } finally {
      this.isLoading = false;
    }
  }
}
