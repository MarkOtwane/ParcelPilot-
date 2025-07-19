import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { MetricsService } from '../../core/services/metrics.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    this.renderChart();
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

  renderChart() {
    const ctx = document.getElementById('metricsChart') as HTMLCanvasElement;
    if (!ctx || !this.stats) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Users', 'Parcels', 'Payments'],
        datasets: [
          {
            label: 'System Metrics',
            data: [
              this.stats.users,
              this.stats.parcels,
              this.stats.totalPayments,
            ],
            backgroundColor: [
              'rgba(25, 118, 210, 0.7)',
              'rgba(102, 126, 234, 0.7)',
              'rgba(46, 204, 113, 0.7)',
            ],
            borderColor: [
              'rgba(25, 118, 210, 1)',
              'rgba(102, 126, 234, 1)',
              'rgba(46, 204, 113, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'System Metrics Overview' },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }
}
