import { BaseEntity } from '@/common/entities/base.entity';
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    STAFF = "staff"
}
export declare class User extends BaseEntity {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    avatar?: string;
    isActive: boolean;
    lastLogin?: Date;
    refreshToken?: string;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
