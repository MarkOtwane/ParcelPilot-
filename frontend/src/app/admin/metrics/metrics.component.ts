import { Component, OnInit } from '@angular/core';
import { MetricsService } from 'src/app/core/services/metrics.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit {
  isLoading = true;
  stats: any;

  pieChartLabels: string[] = ['Pending', 'In Transit', 'Delivered'];
  pieChartData: number[] = [];
  pieChartType: ChartType = 'pie';

  constructor(
    private metricsService: MetricsService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    try {
      this.stats = await this.metricsService.getDashboardStats();

      this.pieChartData = [
        this.stats.pendingParcels || 0,
        this.stats.inTransitParcels || 0,
        this.stats.completedParcels || 0,
      ];
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to load metrics');
    } finally {
      this.isLoading = false;
    }
  }
}
