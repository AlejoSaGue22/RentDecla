import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../database/entities/user.entity';
import { Tenant } from '../../database/entities/tenant.entity';
import { Client, ClientStatus } from '../../database/entities/client.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { tenant: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('User is inactive');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.generateTokens(user);
  }

  async register(createUserDto: { name: string; email: string; password: string; tenantSlug?: string }) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    let tenant: Tenant | null = null;
    if (createUserDto.tenantSlug) {
      tenant = await this.tenantRepository.findOne({
        where: { slug: createUserDto.tenantSlug },
      });
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      tenantId: tenant?.id,
      role: tenant ? 'contador' as any : 'super_admin' as any,
    });

    await this.userRepository.save(user);
    return this.generateTokens(user);
  }

  async refreshToken(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.generateTokens(user);
  }

  async acceptInvitation(token: string, password: string) {
    const client = await this.clientRepository.findOne({
      where: { invitationToken: token },
    });

    if (!client) throw new NotFoundException('Invalid invitation token');
    if (client.status !== ClientStatus.PENDING_INVITATION) {
      throw new BadRequestException('Invitation already accepted or expired');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: client.email },
    });
    if (existingUser) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
      password: hashedPassword,
      tenantId: client.tenantId,
      role: 'client' as any,
    });
    await this.userRepository.save(user);

    client.status = ClientStatus.PENDING_PROFILE;
    client.invitationAcceptedAt = new Date();
    client.invitationToken = undefined;
    await this.clientRepository.save(client);

    return this.generateTokens(user);
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d') as any,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}
