import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.scss'],
})
export class ParcelsComponent implements OnInit {
  isLoading = true;
  sent: any[] = [];
  received: any[] = [];

  constructor(
    private parcelService: ParcelService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    try {
      const res = await this.parcelService.getMyParcels();
      this.sent = res.sent || [];
      this.received = res.received || [];
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to load parcels');
    } finally {
      this.isLoading = false;
    }
  }
}
