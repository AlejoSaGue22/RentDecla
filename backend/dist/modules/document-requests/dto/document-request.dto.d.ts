export declare class CreateDocumentRequestDto {
    title: string;
    description?: string;
    dueDate?: Date;
    priority?: number;
    isRequired?: boolean;
    clientId: string;
}
export declare class UpdateDocumentRequestDto {
    title?: string;
    description?: string;
    dueDate?: Date;
    priority?: number;
    isRequired?: boolean;
    status?: string;
}
