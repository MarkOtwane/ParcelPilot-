import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../core/services/support.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class SupportComponent implements OnInit {
  tickets: any[] = [];
  loading = false;
  isLoading = false;
  error = '';
  respondingId: string | null = null;
  responseText = '';

  constructor(private supportService: SupportService) {}

  async ngOnInit() {
    await this.loadTickets();
  }

  async loadTickets() {
    this.loading = true;
    this.isLoading = true;
    this.error = '';

    try {
      this.tickets = await this.supportService.getAllTickets();
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to load support tickets.';
    } finally {
      this.loading = false;
      this.isLoading = false;
    }
  }

  startResponding(ticketId: string) {
    this.respondingId = ticketId;
    this.responseText = '';
  }

  async sendResponse(ticketId: string) {
    if (!this.responseText.trim()) {
      return;
    }

    try {
      await this.supportService.respondToTicket(ticketId, this.responseText);
      this.respondingId = null;
      this.responseText = '';
      await this.loadTickets(); // Reload to get updated data
    } catch (error: any) {
      this.error = error.error?.message || 'Failed to send response.';
    }
  }
}
