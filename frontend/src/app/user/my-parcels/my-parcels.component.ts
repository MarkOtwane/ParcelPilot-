import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParcelService } from '../../core/services/parcel.service';

@Component({
  selector: 'app-my-parcels',
  templateUrl: './my-parcels.component.html',
  styleUrls: ['./my-parcels.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MyParcelsComponent implements OnInit {
  parcels: any = { sent: [], received: [] };
  loading = false;
  error = '';
  selectedParcel: any = null;

  constructor(private parcelService: ParcelService) {}

  async ngOnInit() {
    await this.loadParcels();
  }

  async loadParcels() {
    this.loading = true;
    this.error = '';
    
    try {
      this.parcels = await this.parcelService.getMyParcels();
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to load parcels.';
    } finally {
      this.loading = false;
    }
  }

  viewParcelDetails(parcel: any) {
    this.selectedParcel = parcel;
  }

  closeModal() {
    this.selectedParcel = null;
  }

  editParcel(parcel: any) {
    // Navigate to edit page with parcel data
    // You can implement this as a separate route or modal
    console.log('Edit parcel:', parcel);
    // For now, we'll just show an alert
    alert(`Edit functionality for parcel ${parcel.id} would be implemented here.`);
  }

  async deleteParcel(parcelId: string) {
    if (confirm('Are you sure you want to delete this parcel? This action cannot be undone.')) {
      try {
        await this.parcelService.deleteParcel(parcelId);
        this.error = '';
        await this.loadParcels(); // Reload the list
      } catch (error: any) {
        this.error = error.error?.message || 'Failed to delete parcel.';
      }
    }
  }
}
