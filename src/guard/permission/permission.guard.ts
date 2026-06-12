import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/common/decorator/permission.decorator';
import { PERMISSION, ROLE } from 'src/common/enum/role.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PERMISSION[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Authenticate use role as admin allow to bypass the permission check.
    if (user?.role === ROLE.SUPER_ADMIN) {
      return true;
    }

    return requiredPermissions.some((permission) =>
      user.permission?.includes(permission),
    );
  }
}
