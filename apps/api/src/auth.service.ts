import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from './prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';

const userSelect = { id: true, name: true, email: true, phone: true, role: true, createdAt: true } as const;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const phone = dto.phone.trim();
    const existing = await this.prisma.user.findFirst({ where: { OR: [{ email }, { phone }] }, select: { id: true } });
    if (existing) throw new ConflictException('An account with that email or phone already exists');
    const user = await this.prisma.user.create({ data: { name: dto.name.trim(), email, phone, password: await argon2.hash(dto.password) }, select: userSelect });
    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const identifier = dto.emailOrPhone.trim();
    const user = await this.prisma.user.findFirst({ where: { OR: [{ email: identifier.toLowerCase() }, { phone: identifier }] } });
    if (!user || !(await argon2.verify(user.password, dto.password))) throw new UnauthorizedException('Invalid email, phone, or password');
    return this.issueToken({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt });
  }

  async profile(token: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(token, { secret: this.secret });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub }, select: userSelect });
      if (!user) throw new UnauthorizedException();
      return user;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private get secret() {
    return process.env.JWT_ACCESS_SECRET || 'development-only-change-me';
  }

  private async issueToken(user: { id: string; name: string; email: string; phone: string; role: string; createdAt: Date }) {
    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role }, { secret: this.secret, expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' });
    return { accessToken, user };
  }
}
