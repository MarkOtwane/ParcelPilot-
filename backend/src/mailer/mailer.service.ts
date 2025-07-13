import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ParcelStatus } from '@prisma/client';

interface Parcel {
  pickupLocation: string;
  destination: string;
  weight: number;
  cost: number;
}

@Injectable()
export class MailerService {
  constructor(private mailer: NestMailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Welcome to SendIT 🚀',
        template: 'welcome',
        context: { name },
      });
    } catch (error) {
      // Log the error but don't fail the registration
      console.log(`Failed to send welcome email to ${email}:`, error.message);
    }
  }

  async sendResetPasswordEmail(email: string, token: string) {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await this.mailer.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: 'reset-password',
        context: { resetLink },
      });
    } catch (error) {
      // Log the error but don't fail the password reset
      console.log(
        `Failed to send reset password email to ${email}:`,
        error.message,
      );
    }
  }

  async sendParcelCreatedEmail(
    senderEmail: string,
    receiverEmail: string,
    parcel: Parcel,
  ) {
    try {
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
    } catch (error) {
      // Log the error but don't fail the parcel creation
      console.log(`Failed to send parcel created email:`, error.message);
    }
  }

  async sendParcelStatusUpdateEmail(
    senderEmail: string,
    receiverEmail: string,
    status: ParcelStatus,
  ) {
    try {
      await this.mailer.sendMail({
        to: [senderEmail, receiverEmail],
        subject: `Parcel Status Updated: ${status}`,
        template: 'parcel-status',
        context: { status },
      });
    } catch (error) {
      // Log the error but don't fail the status update
      console.log(`Failed to send parcel status update email:`, error.message);
    }
  }

  sendSms(to: string, body: string) {
    // Simple SMS simulation - in production, replace with actual SMS service
    console.log(`SMS to ${to}: ${body}`);
    return { success: true, message: 'SMS sent successfully' };
  }
}
