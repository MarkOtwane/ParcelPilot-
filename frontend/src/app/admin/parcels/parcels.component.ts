import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ParcelService } from '../../core/services/parcel.service';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ParcelsComponent implements OnInit {
  parcels: any[] = [];
  loading = false;
  isLoading = false;
  error = '';
  statusOptions = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];

  constructor(private parcelService: ParcelService) {}

  async ngOnInit() {
    await this.loadParcels();
  }

  async loadParcels() {
    this.loading = true;
    this.isLoading = true;
    this.error = '';

    try {
      this.parcels = await this.parcelService.getAllParcels();
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to load parcels.';
    } finally {
      this.loading = false;
      this.isLoading = false;
    }
  }

  async updateStatus(parcelId: string, status: string) {
    try {
      await this.parcelService.updateStatus(parcelId, status);
      // Reload parcels to get updated data
      await this.loadParcels();
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to update parcel status.';
    }
  }
}
