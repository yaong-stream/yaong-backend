import * as nodeMailer from "nodemailer";
import * as SMTPPool from "nodemailer/lib/smtp-pool";
import {
  Injectable,
  Logger,
} from "@nestjs/common";
import {
  ConfigService,
} from "@nestjs/config";

@Injectable()
export class MailerService {

  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: nodeMailer.Transporter<SMTPPool.SentMessageInfo, SMTPPool.Options>;
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodeMailer.createTransport({
      host: this.configService.getOrThrow<string>("smtp.host"),
      port: this.configService.getOrThrow<number>("smtp.port"),
      secure: this.configService.getOrThrow<boolean>("smtp.secure"),
      pool: true,
      maxConnections: 10,
      maxMessages: 100,
      rateLimit: 5,
      auth: {
        user: this.configService.getOrThrow<string>("smtp.username"),
        pass: this.configService.getOrThrow<string>("smtp.password"),
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
}
