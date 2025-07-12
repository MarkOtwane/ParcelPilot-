import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = true;

  sentCount = 0;
  receivedCount = 0;
  delivered = 0;
  inTransit = 0;
  pending = 0;
  paymentsTotal = 0;

  constructor(
    private parcelService: ParcelService,
    private paymentService: PaymentService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    try {
      const parcels = await this.parcelService.getMyParcels();
      const sent = parcels.sent || [];
      const received = parcels.received || [];

      this.sentCount = sent.length;
      this.receivedCount = received.length;

      this.delivered = sent.filter((p) => p.status === 'DELIVERED').length;
      this.inTransit = sent.filter((p) => p.status === 'IN_TRANSIT').length;
      this.pending = sent.filter((p) => p.status === 'PENDING').length;

      const payments = await this.paymentService.getMyPayments();
      this.paymentsTotal = payments.reduce(
        (sum: number, p: any) => sum + p.amount,
        0
      );
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to load dashboard data');
    } finally {
      this.isLoading = false;
    }
  }
}
