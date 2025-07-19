import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParcelService } from '../../core/services/parcel.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ParcelsComponent implements OnInit {
  parcels: any[] = [];
  filteredParcels: any[] = [];
  loading = false;
  isLoading = false;
  error = '';
  successMessage = '';
  selectedParcel: any = null;
  isEditing = false;
  statusOptions = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];
  statusFilter = '';
  searchTerm = '';
  editForm = {
    pickupLocation: '',
    destination: '',
    weight: 0,
    status: '',
    cost: 0,
  };

  constructor(private parcelService: ParcelService) {}

  async ngOnInit() {
    await this.loadParcels();
  }

  async loadParcels() {
    this.loading = true;
    this.isLoading = true;
    this.successMessage = '';

    try {
      this.parcels = await this.parcelService.getAllParcels();
      this.applyFilters();
    } finally {
      this.loading = false;
      this.isLoading = false;
    }
  }

  applyFilters() {
    this.filteredParcels = this.parcels.filter((parcel) => {
      const matchesStatus =
        !this.statusFilter || parcel.status === this.statusFilter;
      const matchesSearch =
        !this.searchTerm ||
        parcel.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        parcel.pickupLocation
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        parcel.destination
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        (parcel.sender?.name &&
          parcel.sender.name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())) ||
        (parcel.sender?.email &&
          parcel.sender.email
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())) ||
        (parcel.receiver?.name &&
          parcel.receiver.name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())) ||
        (parcel.receiver?.email &&
          parcel.receiver.email
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()));

      return matchesStatus && matchesSearch;
    });
  }

  getParcelsByStatus(status: string): any[] {
    return this.parcels.filter((p) => p.status === status);
  }

  async updateStatus(parcelId: string, status: string) {
    try {
      await this.parcelService.updateStatus(parcelId, status);
      this.successMessage = `Parcel status updated to ${status} successfully.`;
      await this.loadParcels(); // Reload to get updated data
      setTimeout(() => (this.successMessage = ''), 3000);
    } catch {}
  }

  viewParcelDetails(parcel: any) {
    this.selectedParcel = parcel;
    this.isEditing = false;
  }

  editParcel(parcel: any) {
    this.selectedParcel = parcel;
    this.editForm = {
      pickupLocation: parcel.pickupLocation || '',
      destination: parcel.destination || '',
      weight: parcel.weight || 0,
      status: parcel.status || 'PENDING',
      cost: parcel.cost || 0,
    };
    this.isEditing = true;
  }

  async saveParcel() {
    if (!this.selectedParcel) return;

    try {
      await this.parcelService.updateParcel(
        this.selectedParcel.id,
        this.editForm
      );
      this.successMessage = 'Parcel updated successfully.';
      this.isEditing = false;
      this.selectedParcel = null;
      await this.loadParcels(); // Reload the list
      setTimeout(() => (this.successMessage = ''), 3000);
    } catch {}
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedParcel = null;
    this.editForm = {
      pickupLocation: '',
      destination: '',
      weight: 0,
      status: '',
      cost: 0,
    };
  }

  closeModal() {
    this.selectedParcel = null;
    this.isEditing = false;
    this.editForm = {
      pickupLocation: '',
      destination: '',
      weight: 0,
      status: '',
      cost: 0,
    };
  }

  async deleteParcel(parcelId: string) {
    if (
      confirm(
        'Are you sure you want to delete this parcel? This action cannot be undone.'
      )
    ) {
      try {
        await this.parcelService.deleteParcel(parcelId);
        this.successMessage = 'Parcel deleted successfully.';
        await this.loadParcels(); // Reload the list
        setTimeout(() => (this.successMessage = ''), 3000);
      } catch {}
    }
  }

  async refreshParcels() {
    await this.loadParcels();
  }

  exportParcels() {
    // Export functionality - you can implement CSV/Excel export here
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parcels-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSV(): string {
    const headers = [
      'ID',
      'Status',
      'Pickup Location',
      'Destination',
      'Weight',
      'Cost',
      'Sender',
      'Receiver',
      'Created',
    ];
    const rows = this.filteredParcels.map((p) => [
      p.id,
      p.status,
      p.pickupLocation,
      p.destination,
      p.weight,
      p.cost,
      p.sender?.name || p.sender?.email || 'N/A',
      p.receiver?.name || p.receiver?.email || 'N/A',
      new Date(p.createdAt).toLocaleDateString(),
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  }
}
