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
} 