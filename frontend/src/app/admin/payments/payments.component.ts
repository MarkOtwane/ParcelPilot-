import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/core/services/payment.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-admin-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  isLoading = true;
  payments: any[] = [];

  constructor(
    private paymentService: PaymentService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    try {
      this.payments = await this.paymentService.getAllPayments();
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to load payments.');
    } finally {
      this.isLoading = false;
    }
  }
}
