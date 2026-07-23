import { ClientStatus } from '../../../database/entities/client.entity';
export declare class CreateClientDto {
    firstName: string;
    lastName: string;
    documentNumber: string;
    documentType?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    nationality?: string;
    notes?: string;
}
export declare class UpdateClientDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    nationality?: string;
    status?: ClientStatus;
    notes?: string;
    assignedToId?: string;
}
export declare class ResendInvitationDto {
    email?: string;
}
export declare class ClientQueryDto {
    status?: ClientStatus;
    assignedToId?: string;
    search?: string;
}
