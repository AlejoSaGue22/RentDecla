export declare class MailerService {
    private readonly logger;
    private transporter;
    private templates;
    constructor();
    private loadTemplates;
    sendEmail(to: string, subject: string, html: string): Promise<boolean>;
    sendTemplateEmail(to: string, subject: string, templateName: string, variables?: Record<string, string>): Promise<boolean>;
    private getFallbackTemplate;
}
