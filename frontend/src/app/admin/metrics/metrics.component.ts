import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsService } from '../../core/services/metrics.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MetricsComponent implements OnInit {
  metrics: any = {};
  stats: any = {};
  loading = false;
  isLoading = false;
  error = '';

  constructor(private metricsService: MetricsService) {}

  async ngOnInit() {
    await this.loadMetrics();
  }

  async loadMetrics() {
    this.loading = true;
    this.isLoading = true;
    this.error = '';
    
    try {
      this.metrics = await this.metricsService.getMetrics();
      this.stats = this.metrics; // Map metrics to stats for template compatibility
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to load metrics.';
    } finally {
      this.loading = false;
      this.isLoading = false;
    }
  }
}
