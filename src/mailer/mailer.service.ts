import * as nodeMailer from 'nodemailer';
import * as SMTPPool from 'nodemailer/lib/smtp-pool';
import {
  Injectable,
} from '@nestjs/common';
import {
  ConfigService,
} from '@nestjs/config';

@Injectable()
export class MailerService {

  private readonly transporter: nodeMailer.Transporter<SMTPPool.SentMessageInfo, SMTPPool.Options>;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodeMailer.createTransport({
      host: this.configService.getOrThrow<string>('smtp.host'),
      port: this.configService.getOrThrow<number>('smtp.port'),
      secure: this.configService.getOrThrow<boolean>('smtp.secure'),
      pool: true,
      maxConnections: 10,
      maxMessages: 100,
      rateLimit: 5,
      auth: {
        user: this.configService.getOrThrow<string>('smtp.username'),
        pass: this.configService.getOrThrow<string>('smtp.password'),
      },
    });
  }

  public async sendEmail(emails: string[], subject: string, html: string) {
    await this.transporter.sendMail({
      from: `yaong <${this.configService.getOrThrow<string>('smtp.username')}>`,
      bcc: emails,
      subject,
      html,
    });
  }

  public async sendEmailVerify(email: string, verificationLink: string) {
    const html = `
    <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;'>
      <div style='max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;'>
        <h2 style='margin-bottom: 16px;'>이메일 인증 요청</h2>
        <p style='margin-bottom: 20px;'>이메일 인증을 완료하려면 아래 버튼을 클릭하세요.</p>
        <a href='${verificationLink}' style='display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;'>이메일 인증</a>
        <p style='margin-top: 20px; font-size: 12px; color: #777;'>이 링크는 1시간 동안 유효합니다.<br>문제가 있으면 고객 지원에 문의하세요.</p>
      </div>
    </body>
    `;
    await this.sendEmail([email], '이메일 인증 요청', html);
  }
}
