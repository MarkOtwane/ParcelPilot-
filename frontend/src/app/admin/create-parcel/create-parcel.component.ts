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
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-create-parcel',
  templateUrl: './create-parcel.component.html',
  styleUrls: ['./create-parcel.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Removed GoogleMapsModule
})
export class CreateParcelComponent {
  parcelForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  // Removed Google Maps state
  // pickupCenter = { lat: -1.286389, lng: 36.817223 };
  // destinationCenter = { lat: -1.286389, lng: 36.817223 };
  // mapZoom = 12;

  // Removed distance and cost calculation based on coordinates
  calculatedCost: number | null = null;
  paymentConfirmed = false;
  baseRate = 100; // Flat rate per parcel (or per kg if you want)

  constructor(
    private fb: FormBuilder,
    private parcelService: ParcelService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.parcelForm = this.fb.group({
      senderEmail: ['', [Validators.required, Validators.email]],
      receiverEmail: ['', [Validators.required, Validators.email]],
      pickupLocation: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      weight: ['', [Validators.required, Validators.min(0.1)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      // Removed pickupLat, pickupLng, destinationLat, destinationLng
    });
  }

  // Removed setPickupLocation and setDestinationLocation

  // Simple cost calculation (e.g., per kg)
  onWeightChange() {
    const weight = this.parcelForm.value.weight;
    if (weight > 0) {
      this.calculatedCost = this.baseRate * weight;
    } else {
      this.calculatedCost = null;
    }
  }

  confirmPayment() {
    this.paymentConfirmed = true;
  }

  async onSubmit() {
    console.log('Form value:', this.parcelForm.value);
    console.log('Form valid:', this.parcelForm.valid);
    if (!this.paymentConfirmed) {
      this.error = 'Please confirm payment before submitting.';
      return;
    }
    if (this.parcelForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      // Clean form data: remove null/empty/undefined optional fields and forbidden fields
      const rawData = { ...this.parcelForm.value };
      const forbiddenFields = [
        'cost',
        'pickupLat',
        'pickupLng',
        'destinationLat',
        'destinationLng',
      ];
      const cleanedData: any = {};
      Object.keys(rawData).forEach((key) => {
        const value = rawData[key];
        if (
          value !== null &&
          value !== undefined &&
          !(typeof value === 'string' && value.trim() === '') &&
          !forbiddenFields.includes(key)
        ) {
          cleanedData[key] = value;
        }
      });

      try {
        const parcel = await this.parcelService.createParcel(cleanedData);
        // Automatically initiate payment for the created parcel
        await this.paymentService.initiatePayment({
          parcelId: parcel.id,
          method: 'MPESA', // or your default method
        });
        this.success = 'Parcel created and payment initiated successfully!';
        setTimeout(() => {
          this.router.navigate(['/user/payments']);
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
