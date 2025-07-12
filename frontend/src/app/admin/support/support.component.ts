import { Component, OnInit } from '@angular/core';
import { SupportService } from 'src/app/core/services/support.service';
import { NotificationService } from 'src/app/shared/components/notification/notification.service';

@Component({
  selector: 'app-admin-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  isLoading = true;
  tickets: any[] = [];
  respondingId: string | null = null;
  responseText: string = '';

  constructor(
    private supportService: SupportService,
    private notify: NotificationService
  ) {}

  async ngOnInit() {
    try {
      this.tickets = await this.supportService.getAllTickets();
    } catch (err: any) {
      this.notify.error(
        err?.error?.message || 'Failed to load support tickets.'
      );
    } finally {
      this.isLoading = false;
    }
  }

  startResponding(id: string) {
    this.respondingId = id;
    this.responseText = '';
  }

  async sendResponse(ticketId: string) {
    if (!this.responseText.trim()) return;

    try {
      await this.supportService.respondToTicket(ticketId, this.responseText);
      const ticket = this.tickets.find((t) => t.id === ticketId);
      if (ticket) ticket.response = this.responseText;
      this.notify.success('Response sent!');
      this.respondingId = null;
    } catch (err: any) {
      this.notify.error(err?.error?.message || 'Failed to send response.');
    }
  }
}
