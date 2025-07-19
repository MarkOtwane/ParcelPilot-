import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];
  loading = false;
  isLoading = false;
  error = '';

  constructor(private paymentService: PaymentService) {}

  async ngOnInit() {
    await this.loadPayments();
  }

  async loadPayments() {
    this.loading = true;
    this.isLoading = true;
    this.error = '';
    
    try {
      this.payments = await this.paymentService.getAllPayments();
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to load payments.';
    } finally {
      this.loading = false;
      this.isLoading = false;
    }
  }
}
