import { Controller, Get, Query } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('test-mailer')
export class MailerTestController {
  constructor(private readonly mailer: MailerService) {}

  @Get()
  async sendTest(@Query('to') to: string) {
    await this.mailer.sendWelcomeEmail(to, 'Test User');
    return { message: 'Test email sent (if no error)' };
  }
}
