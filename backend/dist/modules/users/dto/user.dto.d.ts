import { UserRole } from '../../../common/decorators/roles.decorator';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
}
export declare class UpdateUserDto {
    name?: string;
    password?: string;
    phone?: string;
    role?: UserRole;
    isActive?: boolean;
}
export declare class UserQueryDto {
    role?: UserRole;
    search?: string;
}
