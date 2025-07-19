import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetricsService } from '../../core/services/metrics.service';
import { ParcelService } from '../../core/services/parcel.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class DashboardComponent implements OnInit {
  metrics: any = {};
  stats: any = {};
  loading = false;
  isLoading = false;
  error = '';

  parcels: any[] = [];
  parcelsLoading = false;
  parcelError = '';
  statusOptions = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];

  constructor(
    private metricsService: MetricsService,
    private parcelService: ParcelService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadMetrics();
    await this.loadParcels();
  }

  async loadMetrics() {
    this.loading = true;
    this.isLoading = true;
    this.error = '';

    try {
      console.log('Admin Dashboard - calling getMetrics()');
      this.metrics = await this.metricsService.getMetrics();
      console.log('Admin Dashboard - metrics:', this.metrics);

      this.stats = this.metrics; // Map metrics to stats for template compatibility
      console.log('Admin Dashboard - stats:', this.stats);
    } catch (error: any) {
      console.error('Admin Dashboard - error:', error);
      this.error = error.error?.message || 'Failed to load metrics.';
    } finally {
      this.loading = false;
      this.isLoading = false;
    }
  }

  async loadParcels() {
    this.parcelsLoading = true;
    this.parcelError = '';
    try {
      this.parcels = await this.parcelService.getAllParcels();
    } catch (error: any) {
      this.parcelError = error.error?.message || 'Failed to load parcels.';
    } finally {
      this.parcelsLoading = false;
    }
  }

  async updateStatus(parcelId: string, status: string) {
    try {
      await this.parcelService.updateStatus(parcelId, status);
      await this.loadParcels();
    } catch (error) {
      this.parcelError = 'Failed to update status.';
    }
  }

  async approveParcel(parcelId: string) {
    await this.updateStatus(parcelId, 'IN_TRANSIT');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  get totalWeight(): number {
    return this.parcels.reduce((sum, p) => sum + (p.weight || 0), 0);
  }

  get totalCost(): number {
    return this.parcels.reduce((sum, p) => sum + (p.cost || 0), 0);
  }
}
