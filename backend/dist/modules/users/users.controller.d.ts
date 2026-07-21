import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto, tenantId: string): Promise<import("../../database/entities").User>;
    findAll(query: UserQueryDto, tenantId: string): Promise<import("../../database/entities").User[]>;
    findOne(id: string): Promise<import("../../database/entities").User>;
    update(id: string, dto: UpdateUserDto): Promise<import("../../database/entities").User>;
    remove(id: string): Promise<import("../../database/entities").User>;
}
