import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AcceptInvitationDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../../common/decorators/roles.decorator").UserRole;
            tenantId: string | undefined;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../../common/decorators/roles.decorator").UserRole;
            tenantId: string | undefined;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../../common/decorators/roles.decorator").UserRole;
            tenantId: string | undefined;
        };
    }>;
    acceptInvitation(dto: AcceptInvitationDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../../common/decorators/roles.decorator").UserRole;
            tenantId: string | undefined;
        };
    }>;
}
