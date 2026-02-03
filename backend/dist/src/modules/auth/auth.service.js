"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await user.validatePassword(password)) {
            return user;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        await this.usersService.update(user.id, { lastLogin: new Date() });
        const tokens = await this.generateTokens(user);
        await this.usersService.update(user.id, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10)
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
            },
            ...tokens,
        };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const user = await this.usersService.create(registerDto);
        const tokens = await this.generateTokens(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            ...tokens,
        };
    }
    async changePassword(userId, dto) {
        const user = await this.usersService.findOne(userId);
        const isValid = await user.validatePassword(dto.currentPassword);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        await this.usersService.update(user.id, { password: dto.newPassword });
        return { message: 'Password changed successfully' };
    }
    async forgotPassword(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            return { message: 'If an account exists, a reset link has been sent.' };
        }
        const payload = { sub: user.id, email: user.email, type: 'reset' };
        const secret = this.configService.get('JWT_RESET_SECRET') ||
            this.configService.get('JWT_SECRET');
        const token = await this.jwtService.signAsync(payload, {
            secret,
            expiresIn: this.configService.get('JWT_RESET_EXPIRES_IN', '30m'),
        });
        return {
            message: 'If an account exists, a reset link has been sent.',
            token,
        };
    }
    async resetPassword(dto) {
        const secret = this.configService.get('JWT_RESET_SECRET') ||
            this.configService.get('JWT_SECRET');
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(dto.token, { secret });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        if (!payload?.sub || payload?.type !== 'reset') {
            throw new common_1.UnauthorizedException('Invalid reset token');
        }
        const user = await this.usersService.findOne(payload.sub).catch(() => {
            throw new common_1.NotFoundException('User not found');
        });
        await this.usersService.update(user.id, { password: dto.newPassword });
        return { message: 'Password reset successfully' };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.usersService.findOne(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const tokens = await this.generateTokens(user);
        await this.usersService.update(user.id, {
            refreshToken: await bcrypt.hash(tokens.refreshToken, 10)
        });
        return tokens;
    }
    async logout(userId) {
        await this.usersService.update(userId, { refreshToken: undefined });
    }
    async generateTokens(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map