import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from 'src/common/decorator/public.decorator';
import { PERMISSION, ROLE } from 'src/common/enum/role.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.header('authorization');

    // check missing header
    if (!authHeader) {
      throw new UnauthorizedException('Missing Header');
    }

    // check header format
    const extractHeader = authHeader.split(' ')[1];
    if (!extractHeader) {
      throw new UnauthorizedException('Invalid auth header format');
    }

    // check if token is valid
    const token = await this.prismaService.session.findFirst({
      where: {
        token: extractHeader,
      },
      include: { user: true },
    });
    if (!token || token.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Session not found or expired');
    }

    // Attach user to request
    request.user = {
      user: token.user,
      tokenId: token.id,
      role: ROLE.SUPER_ADMIN,
      // permission: [PERMISSION.ADMIN_READ, PERMISSION.ADMIN_CREATE],
    };

    return true;
  }
}
