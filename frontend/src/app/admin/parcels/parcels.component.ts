import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-admin-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.scss'],
})
export class ParcelsComponent implements OnInit {
  isLoading = true;
  parcels: any[] = [];

  statusOptions = ['PENDING', 'IN_TRANSIT', 'DELIVERED'];

  constructor(
    private parcelService: ParcelService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    try {
      this.parcels = await this.parcelService.getAllParcels();
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to load parcels.');
    } finally {
      this.isLoading = false;
    }
  }

  async updateStatus(parcelId: string, newStatus: string) {
    try {
      await this.parcelService.updateStatus(parcelId, newStatus);
      this.notify.success('Status updated!');
      const parcel = this.parcels.find((p) => p.id === parcelId);
      if (parcel) parcel.status = newStatus;
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to update status.');
    }
  }
}
