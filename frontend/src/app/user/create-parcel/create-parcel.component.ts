import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ParcelService } from '../../core/services/parcel.service';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-create-parcel',
  templateUrl: './create-parcel.component.html',
  styleUrls: ['./create-parcel.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, GoogleMapsModule],
})
export class CreateParcelComponent {
  parcelForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  // Google Maps state
  pickupCenter = { lat: -1.286389, lng: 36.817223 };
  destinationCenter = { lat: -1.286389, lng: 36.817223 };
  mapZoom = 12;

  constructor(
    private fb: FormBuilder,
    private parcelService: ParcelService,
    private router: Router
  ) {
    this.parcelForm = this.fb.group({
      receiverEmail: ['', [Validators.required, Validators.email]],
      pickupLocation: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      weight: ['', [Validators.required, Validators.min(0.1)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      pickupLat: [null, Validators.required],
      pickupLng: [null, Validators.required],
      destinationLat: [null, Validators.required],
      destinationLng: [null, Validators.required],
    });
  }

  setPickupLocation(event: google.maps.MapMouseEvent) {
    const coords = event.latLng?.toJSON();
    if (coords) {
      console.log('Pickup location set:', coords);
      this.parcelForm.patchValue({
        pickupLat: coords.lat,
        pickupLng: coords.lng,
      });
      this.pickupCenter = coords;
    }
  }

  setDestinationLocation(event: google.maps.MapMouseEvent) {
    const coords = event.latLng?.toJSON();
    if (coords) {
      console.log('Destination location set:', coords);
      this.parcelForm.patchValue({
        destinationLat: coords.lat,
        destinationLng: coords.lng,
      });
      this.destinationCenter = coords;
    }
  }

  async onSubmit() {
    console.log('Form value:', this.parcelForm.value);
    console.log('Form valid:', this.parcelForm.valid);
    if (this.parcelForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      try {
        await this.parcelService.createParcel(this.parcelForm.value);
        this.success = 'Parcel created successfully!';
        setTimeout(() => {
          this.router.navigate(['/user/my-parcels']);
        }, 2000);
      } catch (error: any) {
        console.error('Parcel creation error:', error);

        // Handle different error formats
        if (typeof error === 'string') {
          this.error = error;
        } else if (error?.error?.message?.message) {
          // Backend error format: { success: false, message: { message: "...", statusCode: 401 } }
          this.error = error.error.message.message;
        } else if (error?.error?.message) {
          this.error = error.error.message;
        } else if (error?.message) {
          this.error = error.message;
        } else if (error?.error) {
          this.error =
            typeof error.error === 'string'
              ? error.error
              : 'Failed to create parcel';
        } else {
          this.error = 'Failed to create parcel. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    } else {
      console.log('Form errors:', this.parcelForm.errors, this.parcelForm);
    }
  }
}
