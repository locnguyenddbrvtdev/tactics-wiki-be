import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@modules/core/logger/logger.service';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  async sendRecoveryPasswordEmail(email: string, newPassword: string) {
    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      'auth',
      'recovery-password',
      'index.hbs',
    );
    const teamplateSrc = fs.readFileSync(templatePath, 'utf-8');
    if (!teamplateSrc) throw new Error('Template not found');
    const template = handlebars.compile(teamplateSrc.toString());
    const html = template({ newPassword });
    await this.sendEmail({
      from: this.configService.get<string>('mailAddress.auth'),
      to: email,
      subject: 'Khôi phục mật khẩu',
      text: 'Khôi phục mật khẩu',
      html,
    });
  }

  async sendVerifyEmail(email: string, code: string) {
    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      'auth',
      'verify-email',
      'index.hbs',
    );
    const teamplateSrc = fs.readFileSync(templatePath, 'utf-8');
    if (!teamplateSrc) throw new Error('Template not found');
    const template = handlebars.compile(teamplateSrc.toString());
    const html = template({
      url: `${process.env.FE_URL}/auth/verify-email?code=${code}`,
    });
    await this.sendEmail({
      from: this.configService.get<string>('mailAddress.auth'),
      to: email,
      subject: 'Xác thực email',
      text: 'Xác thực email',
      html,
    });
  }

  private async sendEmail({
    from,
    to,
    subject,
    text,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    try {
      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      this.loggerService.info(`Email sent to ${to}`);
    } catch (e) {
      this.loggerService.error(`Email sent to ${to} failed`);
    }
  }
}
