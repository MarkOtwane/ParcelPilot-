/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ParcelStatus } from '@prisma/client';
// import { Twilio } from 'twilio';

interface Parcel {
  pickupLocation: string;
  destination: string;
  weight: number;
  cost: number;
}

export interface WelcomeEmailContext {
  name: string;
}

export interface ResetPasswordEmailContext {
  token: string;
}

export interface ParcelCreatedEmailContext {
  parcel: Parcel;
}

interface ParcelStatusUpdateEmailContext {
  status: ParcelStatus;
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  // private twilio: Twilio;

  constructor(
    private readonly mailer: NestMailerService,
    private readonly configService: ConfigService,
  ) {
    // this.twilio = new Twilio(
    //   this.configService.get('TWILIO_ACCOUNT_SID'),
    //   this.configService.get('TWILIO_AUTH_TOKEN'),
    // );
  }

  // private normalizeKenyanNumber(phone: string): string {
  //   const normalized = phone.trim();
  //   if (normalized.startsWith('+254')) {
  //     return normalized;
  //   }
  //   if (normalized.startsWith('07')) {
  //     return '+254' + normalized.slice(1);
  //   }
  //   if (normalized.startsWith('01')) {
  //     return '+254' + normalized;
  //   }
  //   throw new Error(
  //     'Phone number must be a valid Kenyan number starting with +254, 07, or 01',
  //   );
  // }

  // async sendSms(to: string, body: string): Promise<void> {
  //   try {
  //     const normalizedTo = this.normalizeKenyanNumber(to);
  //     await this.twilio.messages.create({
  //       body,
  //       from: this.configService.get('TWILIO_PHONE_NUMBER'),
  //       to: normalizedTo,
  //     });
  //     this.logger.log(`SMS sent successfully to ${normalizedTo}`);
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to send SMS to ${to}:`,
  //       error instanceof Error ? error.message : String(error),
  //     );
  //     throw new InternalServerErrorException('Failed to send SMS');
  //   }
  // }

  async sendWelcomeEmail(
    email: string,
    context: WelcomeEmailContext,
  ): Promise<void> {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: `Welcome to ${this.configService.get('./templates/welcome.hbs')} 🚀`,
        template: 'welcome',
        context: {
          ...context,
          appName: this.configService.get('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(`Welcome email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${email}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new InternalServerErrorException('Failed to send welcome email');
    }
  }

  async sendResetPasswordEmail(
    email: string,
    context: ResetPasswordEmailContext,
  ): Promise<void> {
    try {
      const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${context.token}`;

      await this.mailer.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: 'reset-password',
        context: {
          resetLink,
          appName: this.configService.get('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(`Password reset email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send reset password email to ${email}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new InternalServerErrorException(
        'Failed to send reset password email',
      );
    }
  }

  async sendParcelCreatedEmail(
    senderEmail: string,
    receiverEmail: string,
    context: ParcelCreatedEmailContext,
  ): Promise<void> {
    try {
      await this.mailer.sendMail({
        to: [senderEmail, receiverEmail],
        subject: 'New Parcel Created 📦',
        template: 'parcel-created',
        context: {
          ...context.parcel,
          appName: this.configService.get('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(
        `Parcel created email sent successfully to ${senderEmail} and ${receiverEmail}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send parcel created email:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new InternalServerErrorException(
        'Failed to send parcel created email',
      );
    }
  }

  async sendParcelStatusUpdateEmail(
    senderEmail: string,
    receiverEmail: string,
    context: ParcelStatusUpdateEmailContext,
  ): Promise<void> {
    try {
      await this.mailer.sendMail({
        to: [senderEmail, receiverEmail],
        subject: `Parcel Status Updated: ${context.status}`,
        template: 'parcel-status',
        context: {
          status: context.status,
          appName: this.configService.get('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(
        `Parcel status update email sent successfully to ${senderEmail} and ${receiverEmail}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send parcel status update email:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new InternalServerErrorException(
        'Failed to send parcel status update email',
      );
    }
  }

  async sendCustomEmail(
    to: string | string[],
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    try {
      await this.mailer.sendMail({
        to,
        subject,
        template,
        context: {
          ...context,
          appName: this.configService.get('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(
        `Custom email sent successfully to ${Array.isArray(to) ? to.join(', ') : to}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send custom email:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new InternalServerErrorException('Failed to send custom email');
    }
  }

  async sendTestEmail(email: string): Promise<void> {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Test Email',
        template: 'test',
        context: {
          name: 'Test User',
          email,
          appName: this.configService.get('APP_NAME'),
          currentYear: new Date().getFullYear().toString(),
          currentDate: new Date().toISOString(),
        },
      });

      this.logger.log(`Test email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send test email to ${email}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new InternalServerErrorException('Failed to send test email');
    }
  }
}
