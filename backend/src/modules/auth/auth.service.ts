import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await user.validatePassword(password)) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login
    await this.usersService.update(user.id, { lastLogin: new Date() });

    const tokens = await this.generateTokens(user);
    
    // Save refresh token
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

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
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

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findOne(userId);
    const isValid = await user.validatePassword(dto.currentPassword);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.usersService.update(user.id, { password: dto.newPassword });
    return { message: 'Password changed successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    // For security, do not reveal whether user exists
    if (!user) {
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const payload = { sub: user.id, email: user.email, type: 'reset' as const };
    const secret =
      this.configService.get<string>('JWT_RESET_SECRET') ||
      this.configService.get<string>('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: this.configService.get('JWT_RESET_EXPIRES_IN', '30m'),
    });

    // TODO: send email with this token using notifications module
    // For now, return token so frontend can show success.
    return {
      message: 'If an account exists, a reset link has been sent.',
      token,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const secret =
      this.configService.get<string>('JWT_RESET_SECRET') ||
      this.configService.get<string>('JWT_SECRET');

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(dto.token, { secret });
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (!payload?.sub || payload?.type !== 'reset') {
      throw new UnauthorizedException('Invalid reset token');
    }

    const user = await this.usersService.findOne(payload.sub).catch(() => {
      throw new NotFoundException('User not found');
    });

    await this.usersService.update(user.id, { password: dto.newPassword });
    return { message: 'Password reset successfully' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user);
    
    await this.usersService.update(user.id, { 
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10) 
    });

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshToken: undefined });
  }

  private async generateTokens(user: User) {
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
}
