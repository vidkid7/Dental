import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, currentUser: User): Promise<User>;
    findAll(paginationDto: PaginationDto, currentUser: User): Promise<import("@/common/dto/pagination.dto").PaginatedResponseDto<User>>;
    findOne(id: string, currentUser: User): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto, currentUser: User): Promise<User>;
    remove(id: string): Promise<void>;
    activate(id: string): Promise<User>;
    deactivate(id: string): Promise<User>;
}
