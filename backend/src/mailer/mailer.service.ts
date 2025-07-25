import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParcelStatus } from '@prisma/client';

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

  constructor(
    private readonly mailer: NestMailerService,
    private readonly configService: ConfigService,
  ) {
    // Validate required environment variables
    const requiredVars = ['APP_NAME', 'FRONTEND_URL'];
    requiredVars.forEach((varName) => {
      if (!this.configService.get<string>(varName)) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    });
  }

  async sendWelcomeEmail(
    email: string,
    context: WelcomeEmailContext,
  ): Promise<void> {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: `Welcome to ${this.configService.get<string>('APP_NAME')} 🚀`,
        template: 'welcome',
        context: {
          ...context,
          appName: this.configService.get<string>('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(`Welcome email sent successfully to ${email}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const errStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send welcome email to ${email}: ${errMsg}`,
        errStack,
      );
      throw new InternalServerErrorException('Failed to send welcome email');
    }
  }

  async sendResetPasswordEmail(
    email: string,
    context: ResetPasswordEmailContext,
  ): Promise<void> {
    try {
      const resetLink = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${context.token}`;

      await this.mailer.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: 'reset-password',
        context: {
          resetLink,
          appName: this.configService.get<string>('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(`Password reset email sent successfully to ${email}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const errStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send reset password email to ${email}: ${errMsg}`,
        errStack,
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
          appName: this.configService.get<string>('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(
        `Parcel created email sent successfully to ${senderEmail} and ${receiverEmail}`,
      );
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const errStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send parcel created email to ${senderEmail}, ${receiverEmail}: ${errMsg}`,
        errStack,
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
          appName: this.configService.get<string>('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(
        `Parcel status update email sent successfully to ${senderEmail} and ${receiverEmail}`,
      );
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const errStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send parcel status update email to ${senderEmail}, ${receiverEmail}: ${errMsg}`,
        errStack,
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
          appName: this.configService.get<string>('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(
        `Custom email sent successfully to ${Array.isArray(to) ? to.join(', ') : to}`,
      );
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const errStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send custom email to ${Array.isArray(to) ? to.join(', ') : to}: ${errMsg}`,
        errStack,
      );
      throw new InternalServerErrorException('Failed to send custom email');
    }
  }

  async sendTestEmail(email: string): Promise<void> {
    try {
      // Use welcome.hbs as fallback since test.hbs is not provided
      await this.mailer.sendMail({
        to: email,
        subject: 'Test Email from SendIT',
        template: 'welcome', // Fallback to welcome template
        context: {
          name: 'Test User',
          appName: this.configService.get<string>('APP_NAME'),
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(`Test email sent successfully to ${email}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const errStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send test email to ${email}: ${errMsg}`,
        errStack,
      );
      throw new InternalServerErrorException('Failed to send test email');
    }
  }
}
