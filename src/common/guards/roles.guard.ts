import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) {
      return true;
    }
    const req = context
      .switchToHttp()
      .getRequest<{ user?: { roles?: Role[] } }>();
    const user = req.user;
    const roles = user?.roles;
    if (!roles?.length) {
      throw new ForbiddenException('Se requiere autenticación');
    }
    const allowed = requiredRoles.some((r) => roles.includes(r));
    if (!allowed) {
      throw new ForbiddenException('No tiene permisos para esta acción');
    }
    return true;
  }
}
