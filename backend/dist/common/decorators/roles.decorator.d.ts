export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    CONTADOR = "contador",
    CLIENT = "client"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
