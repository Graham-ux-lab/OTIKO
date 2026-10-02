import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { RegisterOrganizerDto } from './dto/register-organizer.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from '../auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const phone = dto.phone.trim();
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
      select: { id: true },
    });
    if (existing) throw new BadRequestException('An account with this email or phone already exists');

    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        phone,
        password: await argon2.hash(dto.password),
        role: 'CUSTOMER',
        emailVerified: true,
      },
      select: { id: true, name: true, email: true, phone: true, role: true, status: true },
    });
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m', secret: process.env.JWT_ACCESS_SECRET },
    );
    return { accessToken, user };
  }

  async registerOrganizer(dto: RegisterOrganizerDto) {
    const email = dto.email.trim().toLowerCase();
    const phone = dto.phone.trim();
    this.logger.log(`Registering organizer: ${email}`);

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'User with this email or phone already exists',
      );
    }

    const hashedPassword = await argon2.hash(dto.password);
    const verificationToken = randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email,
        phone,
        name: dto.name.trim(),
        password: hashedPassword,
        role: 'ORGANIZER',
        emailVerificationToken: verificationToken,
        organizerProfile: {
          create: {
            organizationName: dto.organizationName,
            description: dto.description,
            status: 'PENDING',
          },
        },
      },
    });

    // Send verification email
    await this.mailService.sendOrganizerVerification(
      user.email,
      user.name,
      verificationToken,
    );

    const { password, mfaSecret, ...result } = user;
    return {
      message:
        'Organizer application submitted. Please check your email to verify your account.',
      user: result,
    };
  }

  async login(dto: LoginDto) {
    try {
      this.logger.log(`Login attempt: ${dto.emailOrPhone}`);

      const user = await this.prisma.user.findFirst({
      where: {
          OR: [{ email: dto.emailOrPhone.trim().toLowerCase() }, { phone: dto.emailOrPhone.trim() }],
        },
        include: {
          organizerProfile: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Incorrect email/phone or password.');
      }

      const isPasswordValid = await argon2.verify(user.password, dto.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect email/phone or password.');
      }

      if (!user.emailVerified && user.role === 'ORGANIZER') {
        throw new ForbiddenException(
          'Please verify your email before continuing. Check your inbox.',
        );
      }

      if (user.status === 'SUSPENDED') {
        throw new ForbiddenException('Your account has been suspended.');
      }

      if (user.role === 'ORGANIZER' && user.organizerProfile) {
        if (user.organizerProfile.status === 'PENDING') {
          throw new ForbiddenException(
            'Your organizer account is currently under review.',
          );
        }
        if (user.organizerProfile.status === 'REJECTED') {
          throw new ForbiddenException(
            'Your organizer application was rejected.',
          );
        }
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        organizerId: user.organizerProfile?.id,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const { password, mfaSecret, ...result } = user;
      return {
        accessToken,
        refreshToken,
        user: result,
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return { message: 'If the email exists, a reset link has been sent.' };
    }

    const resetToken = randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: resetToken },
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${encodeURIComponent(resetToken)}`;
    const emailSent = await this.mailService.sendMail({
      to: user.email,
      subject: 'Reset your OTIKO password',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px"><h1>Reset your OTIKO password</h1><p>Use the link below to choose a new password. If you did not request this, ignore this email.</p><p><a href="${resetUrl}">Reset password</a></p><p style="word-break:break-all">${resetUrl}</p></div>`,
    });

    if (!emailSent) this.logger.warn(`Password reset email could not be sent to ${user.email}`);

    return { message: 'If the email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: dto.token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await argon2.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerificationToken: null,
      },
    });

    return { message: 'Password reset successfully' };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organizerProfile: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, mfaSecret, ...result } = user;
    return result;
  }
}
