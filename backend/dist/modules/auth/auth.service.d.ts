import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Tenant } from '../../database/entities/tenant.entity';
import { Client } from '../../database/entities/client.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly tenantRepository;
    private readonly clientRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: Repository<User>, tenantRepository: Repository<Tenant>, clientRepository: Repository<Client>, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<{
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
    register(createUserDto: {
        name: string;
        email: string;
        password: string;
        tenantSlug?: string;
    }): Promise<{
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
    refreshToken(userId: string): Promise<{
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
    acceptInvitation(token: string, password: string): Promise<{
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
    private generateTokens;
}
