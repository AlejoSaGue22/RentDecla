"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let MailerService = MailerService_1 = class MailerService {
    logger = new common_1.Logger(MailerService_1.name);
    transporter;
    templates = new Map();
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
    loadTemplates() {
        const templatesDir = path.join(__dirname, 'templates');
        if (!fs.existsSync(templatesDir)) {
            this.logger.warn(`Templates directory not found: ${templatesDir}`);
            return;
        }
        const files = fs.readdirSync(templatesDir);
        for (const file of files) {
            if (file.endsWith('.html')) {
                const templateName = path.basename(file, '.html');
                const templatePath = path.join(templatesDir, file);
                const template = fs.readFileSync(templatePath, 'utf-8');
                this.templates.set(templateName, template);
                this.logger.log(`Loaded template: ${templateName}`);
            }
        }
    }
    async sendEmail(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@rentdecla.com',
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent to ${to}: ${subject}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
            return false;
        }
    }
    async sendTemplateEmail(to, subject, templateName, variables = {}) {
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
    getFallbackTemplate(templateName, variables) {
        const title = variables.title || templateName;
        const message = variables.message || '';
        const actionUrl = variables.actionUrl || '';
        const actionText = variables.actionText || 'Ver detalles';
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
            ${actionUrl ? `<p><a href="${actionUrl}" class="button">${actionText}</a></p>` : ''}
          </div>
          <div class="footer">
            <p>RentDecla - Sistema de Declaración de Renta</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = MailerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailerService);
//# sourceMappingURL=mailer.service.js.map