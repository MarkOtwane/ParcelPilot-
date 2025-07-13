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

@Component({
  selector: 'app-create-parcel',
  templateUrl: './create-parcel.component.html',
  styleUrls: ['./create-parcel.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class CreateParcelComponent {
  parcelForm: FormGroup;
  loading = false;
  error = '';
  success = '';

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
    });
  }

  async onSubmit() {
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
          this.error = typeof error.error === 'string' ? error.error : 'Failed to create parcel';
        } else {
          this.error = 'Failed to create parcel. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
