export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    tenantSlug?: string;
}
export declare class AcceptInvitationDto {
    token: string;
    password: string;
}
