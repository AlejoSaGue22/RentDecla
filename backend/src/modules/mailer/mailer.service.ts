import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;
  private templates: Map<string, string> = new Map();

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT || '2525', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.loadTemplates();
  }

  private loadTemplates() {
    const candidatePaths = [
      path.join(__dirname, 'templates'),
      path.join(process.cwd(), 'src', 'modules', 'mailer', 'templates'),
      path.join(process.cwd(), 'dist', 'src', 'modules', 'mailer', 'templates'),
      path.join(process.cwd(), 'dist', 'modules', 'mailer', 'templates'),
    ];

    const templatesDir = candidatePaths.find((p) => fs.existsSync(p));

    if (!templatesDir) {
      this.logger.warn(`Templates directory not found in candidate paths`);
      return;
    }

    const files = fs.readdirSync(templatesDir);
    for (const file of files) {
      if (file.endsWith('.html')) {
        const templateName = path.basename(file, '.html');
        const templatePath = path.join(templatesDir, file);
        const template = fs.readFileSync(templatePath, 'utf-8');
        this.templates.set(templateName, template);
        this.logger.log(`Loaded template "${templateName}" from ${templatePath}`);
      }
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@rentdecla.com',
        to,
        subject,
        html,
      });

      this.logger.log(`Email successfully dispatched via SMTP to: ${to} (Subject: "${subject}")`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
      return false;
    }
  }

  async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string> = {},
  ): Promise<boolean> {
    let template = this.templates.get(templateName);

    if (!template) {
      this.logger.warn(`Template not found: ${templateName}, using fallback`);
      template = this.getFallbackTemplate(templateName, variables);
    }

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      template = template.replace(new RegExp(placeholder, 'g'), value);
    }

    return this.sendEmail(to, subject, template);
  }

  private getFallbackTemplate(templateName: string, variables: Record<string, string>): string {
    const title = variables.title || variables.clientName || 'Bienvenido a RentDecla';
    const message = variables.message || 'Has sido registrado en nuestro sistema de Declaración de Renta. Para comenzar, por favor completa tu registro definiendo una contraseña.';
    const actionUrl = variables.invitationUrl || variables.actionUrl || '';
    const actionText = variables.actionText || 'Aceptar Invitación';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            <p>${message}</p>
            ${actionUrl ? `<p><a href="${actionUrl}" class="button">${actionText}</a></p><p style="word-break: break-all; color: #2563eb;">${actionUrl}</p>` : ''}
          </div>
          <div class="footer">
            <p>RentDecla - Sistema de Declaración de Renta</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
