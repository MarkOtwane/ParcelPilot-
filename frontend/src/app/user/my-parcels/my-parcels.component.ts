import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParcelService } from '../../core/services/parcel.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-parcels',
  templateUrl: './my-parcels.component.html',
  styleUrls: ['./my-parcels.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class MyParcelsComponent implements OnInit {
  parcels: any = { sent: [], received: [] };
  loading = false;
  error = '';
  selectedParcel: any = null;
  isEditing = false;
  editForm: FormGroup;
  isAdmin = false;

  constructor(private parcelService: ParcelService, private fb: FormBuilder, private authService: AuthService) {
    this.editForm = this.fb.group({
      pickupLocation: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      weight: ['', [Validators.required, Validators.min(0.1)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  async ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const payload = this.authService.decodeJwt(token);
      this.isAdmin = payload?.role === 'ADMIN';
    }
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

  editParcel(parcel: any) {
    if (parcel.status !== 'PENDING') return;
    this.selectedParcel = parcel;
    this.isEditing = true;
    this.editForm.setValue({
      pickupLocation: parcel.pickupLocation || '',
      destination: parcel.destination || '',
      weight: parcel.weight || 0,
      description: parcel.description || '',
    });
  }

  async saveParcel() {
    if (!this.selectedParcel || this.editForm.invalid) return;
    try {
      await this.parcelService.updateMyParcel(this.selectedParcel.id, this.editForm.value);
      this.isEditing = false;
      this.selectedParcel = null;
      await this.loadParcels();
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to update parcel.';
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedParcel = null;
    this.editForm.reset();
  }

  closeModal() {
    this.selectedParcel = null;
    this.isEditing = false;
    this.editForm.reset();
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
