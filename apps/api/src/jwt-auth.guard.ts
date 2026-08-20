import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';

const secret = () => process.env.JWT_ACCESS_SECRET || 'development-only-change-me';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = (request.headers['authorization'] as string) || '';
    if (!header.startsWith('Bearer ')) throw new UnauthorizedException('Missing access token');
    const token = header.slice(7);
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(token, { secret: secret() });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, role: true, status: true },
      });
      if (!user || user.status !== 'ACTIVE') throw new UnauthorizedException('Account is not active');
      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
