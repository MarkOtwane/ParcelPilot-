import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParcelService } from '../../core/services/parcel.service';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ParcelsComponent implements OnInit {
  parcels: any[] = [];
  filteredParcels: any[] = [];
  loading = false;
  isLoading = false;
  error = '';
  successMessage = '';
  selectedParcel: any = null;
  statusOptions = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];
  statusFilter = '';
  searchTerm = '';

  constructor(private parcelService: ParcelService) {}

  async ngOnInit() {
    await this.loadParcels();
  }

  async loadParcels() {
    this.loading = true;
    this.isLoading = true;
    this.error = '';
    this.successMessage = '';

    try {
      this.parcels = await this.parcelService.getAllParcels();
      this.applyFilters();
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to load parcels.';
    } finally {
      this.loading = false;
      this.isLoading = false;
    }
  }

  applyFilters() {
    this.filteredParcels = this.parcels.filter(parcel => {
      const matchesStatus = !this.statusFilter || parcel.status === this.statusFilter;
      const matchesSearch = !this.searchTerm || 
        parcel.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        parcel.pickupLocation.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        parcel.destination.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (parcel.sender?.name && parcel.sender.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (parcel.sender?.email && parcel.sender.email.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (parcel.receiver?.name && parcel.receiver.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (parcel.receiver?.email && parcel.receiver.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchesStatus && matchesSearch;
    });
  }

  getParcelsByStatus(status: string): any[] {
    return this.parcels.filter(p => p.status === status);
  }

  async updateStatus(parcelId: string, status: string) {
    try {
      await this.parcelService.updateStatus(parcelId, status);
      this.successMessage = `Parcel status updated to ${status} successfully.`;
      await this.loadParcels(); // Reload to get updated data
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to update parcel status.';
      setTimeout(() => this.error = '', 5000);
    }
  }

  viewParcelDetails(parcel: any) {
    this.selectedParcel = parcel;
  }

  closeModal() {
    this.selectedParcel = null;
  }

  editParcel(parcel: any) {
    // Navigate to edit page or open edit modal
    console.log('Edit parcel:', parcel);
    alert(`Edit functionality for parcel ${parcel.id} would be implemented here.`);
  }

  async deleteParcel(parcelId: string) {
    if (confirm('Are you sure you want to delete this parcel? This action cannot be undone.')) {
      try {
        await this.parcelService.deleteParcel(parcelId);
        this.successMessage = 'Parcel deleted successfully.';
        await this.loadParcels(); // Reload the list
        setTimeout(() => this.successMessage = '', 3000);
      } catch (error: any) {
        this.error = error.error?.message || 'Failed to delete parcel.';
        setTimeout(() => this.error = '', 5000);
      }
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
    const headers = ['ID', 'Status', 'Pickup Location', 'Destination', 'Weight', 'Cost', 'Sender', 'Receiver', 'Created'];
    const rows = this.filteredParcels.map(p => [
      p.id,
      p.status,
      p.pickupLocation,
      p.destination,
      p.weight,
      p.cost,
      p.sender?.name || p.sender?.email || 'N/A',
      p.receiver?.name || p.receiver?.email || 'N/A',
      new Date(p.createdAt).toLocaleDateString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}
