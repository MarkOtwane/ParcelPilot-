import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ParcelService } from '../../core/services/parcel.service';
import { PaymentService } from '../../core/services/payment.service';
import { NotificationService } from '../../shared/components/notification/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, DecimalPipe],
  standalone: true,
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
      // Load parcels first
      const parcels = await this.parcelService.getMyParcels();
      
      const sent = parcels.sent || [];
      const received = parcels.received || [];

      this.sentCount = sent.length;
      this.receivedCount = received.length;

      this.delivered = sent.filter((p: any) => p.status === 'DELIVERED').length;
      this.inTransit = sent.filter((p: any) => p.status === 'IN_TRANSIT').length;
      this.pending = sent.filter((p: any) => p.status === 'PENDING').length;

      // Load payments separately to avoid breaking the dashboard if payments fail
      try {
        const payments = await this.paymentService.getMyPayments();
        this.paymentsTotal = payments.reduce(
          (sum: number, p: any) => sum + p.amount,
          0
        );
      } catch (paymentError: any) {
        this.paymentsTotal = 0;
      }
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to load dashboard data');
    } finally {
      this.isLoading = false;
    }
  }
}
