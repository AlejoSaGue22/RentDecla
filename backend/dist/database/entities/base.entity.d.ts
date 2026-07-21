import { BaseEntity } from 'typeorm';
export declare abstract class AppBaseEntity extends BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
