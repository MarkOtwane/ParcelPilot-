import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { MailerService } from './mailer.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mailUser = config.get<string>('MAIL_USER');
        const mailPass = config.get<string>('MAIL_PASS');
        const mailFrom = config.get<string>('MAIL_FROM');

        if (!mailUser || !mailPass || !mailFrom) {
          throw new Error(
            'Missing required environment variables: MAIL_USER, MAIL_PASS, or MAIL_FROM',
          );
        }

        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: mailUser,
              pass: mailPass,
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
          defaults: {
            from: `"${config.get<string>('APP_NAME', 'SendIT')} Team" <${mailFrom}>`,
          },
          template: {
            dir: join(__dirname, 'templates'), // Points to dist/src/mailer/templates
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
          options: {
            timeout: 30000,
          },
        };
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
