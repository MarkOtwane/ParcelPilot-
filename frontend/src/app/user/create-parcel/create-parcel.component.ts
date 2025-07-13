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
      receiverId: ['', [Validators.required]],
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
        this.error =
          error.error?.message || 'Failed to create parcel. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
}
