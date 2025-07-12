import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ParcelStatus } from '@prisma/client';
import { Twilio } from 'twilio';

@Injectable()
export class MailerService {
  constructor(
    private mailer: NestMailerService,
    @Inject('TWILIO_CLIENT') private twilio: Twilio,
  ) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailer.sendMail({
      to: email,
      subject: 'Welcome to SendIT 🚀',
      template: 'welcome',
      context: { name },
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.mailer.sendMail({
      to: email,
      subject: 'Reset Your Password',
      template: 'reset-password',
      context: { resetLink },
    });
  }

  async sendParcelCreatedEmail(
    senderEmail: string,
    receiverEmail: string,
    parcel: any,
  ) {
    const data = {
      pickupLocation: parcel.pickupLocation,
      destination: parcel.destination,
      weight: parcel.weight,
      cost: parcel.cost,
    };

    await this.mailer.sendMail({
      to: [senderEmail, receiverEmail],
      subject: 'New Parcel Created 📦',
      template: 'parcel-created',
      context: data,
    });
  }

  async sendParcelStatusUpdateEmail(
    senderEmail: string,
    receiverEmail: string,
    status: ParcelStatus,
  ) {
    await this.mailer.sendMail({
      to: [senderEmail, receiverEmail],
      subject: `Parcel Status Updated: ${status}`,
      template: 'parcel-status',
      context: { status },
    });
  }

  async sendSms(to: string, body: string) {
    const from = process.env.TWILIO_PHONE_NUMBER;
    if (!from) throw new Error('TWILIO_PHONE_NUMBER not set');
    return this.twilio.messages.create({
      body,
      from,
      to,
    });
  }
}
