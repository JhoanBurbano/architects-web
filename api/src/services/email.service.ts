import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { EmailDTO } from '../dto/email.dto';
import * as mustache from 'mustache';
import { S3Service } from './AWS/aws.service';
import { TemplateEmail } from '../enums/template-email.enum';
import { DataTemplateDTO } from '../dto/data-templates.dto';
import mjm2html from 'mjml';
import { Redirects } from '../enums/redirects.enum';
import { JwtTokenService } from './jwt.service';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private s3Service: S3Service,
    private jwtTokenService: JwtTokenService,
  ) {}

  async sendEmail(
    email: EmailDTO,
  ): Promise<{ message: string; success: boolean }> {
    const transport = createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL.USERNAME'),
        pass: this.configService.get<string>('EMAIL.PASSWORD'),
      },
    });

    try {
      const html = await this.getTemplateHTML(email.message, {
        name: email.name,
        lastname: email.lastname,
        callToAction: `${this.configService.get<string>('EMAIL.WEB_URL')}${
          Redirects.LOGIN
        }${this.jwtTokenService.generateTokenPassword(email.email)}`,
      });
      await transport.sendMail({
        from: '"Jhoan Burbano 🫧" <no-reply@architects.com>',
        to: email.email,
        subject: email.subject,
        html,
      });
      return { message: 'The email was sended successfully', success: true };
    } catch (error) {
      console.log('error', error);
      return { message: 'The email was not sended', success: false };
    }
  }

  async getTemplateHTML(message: TemplateEmail, variables: DataTemplateDTO) {
    const mjmlTemplate = await this.s3Service.getTemplate(message);
    const mjmlContent = mustache.render(mjmlTemplate, variables);
    const { html } = mjm2html(mjmlContent);
    return html;
  }
}
