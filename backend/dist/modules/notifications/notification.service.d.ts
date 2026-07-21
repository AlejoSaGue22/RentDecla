import { Repository } from 'typeorm';
import { Notification } from '../../database/entities/notification.entity';
import { MailerService } from '../mailer/mailer.service';
import { Document } from '../../database/entities/document.entity';
import { Client } from '../../database/entities/client.entity';
import { User } from '../../database/entities/user.entity';
export declare class NotificationService {
    private notificationRepository;
    private clientRepository;
    private userRepository;
    private mailerService;
    private readonly logger;
    constructor(notificationRepository: Repository<Notification>, clientRepository: Repository<Client>, userRepository: Repository<User>, mailerService: MailerService);
    notifyDocumentUploaded(document: Document, client: Client): Promise<void>;
    notifyDocumentReviewed(document: Document, client: Client, decision: string, comment?: string): Promise<void>;
    notifyWorkflowCompleted(client: Client, taxYear: number): Promise<void>;
}
