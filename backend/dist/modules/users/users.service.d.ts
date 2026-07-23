import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(dto: CreateUserDto & {
        tenantId?: string;
    }): Promise<User>;
    findAll(tenantId: string | undefined, query: UserQueryDto): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, dto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
}
