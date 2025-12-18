import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SystemRole } from '../../employee-profile/enums/employee-profile.enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: SystemRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<SystemRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has any of the required roles
    // Handle both singular 'role' (from JWT) and plural 'roles' patterns
    const userRoles = user.roles || (user.role ? [user.role] : []);

    // Debug log to help diagnose auth issues (can be removed in production)
    console.log('------------------------------------------------');
    console.log('DEBUG RolesGuard:');
    console.log('User Object:', JSON.stringify(user, null, 2));
    console.log('User Roles (processed):', userRoles);
    console.log('Required Roles:', requiredRoles);
    console.log('------------------------------------------------');

    const hasRole = requiredRoles.some((requiredRole) =>
      userRoles.some(userRole => {
        if (!userRole) return false;

        const uRole = String(userRole).toLowerCase().trim();
        const rRole = String(requiredRole).toLowerCase().trim();

        // 1. Exact or Case-insensitive match (e.g. 'system admin' === 'system admin')
        if (uRole === rRole) return true;

        // 2. Key match (e.g. 'system_admin' vs 'System Admin')
        const enumKey = Object.keys(SystemRole).find(key =>
          SystemRole[key as keyof typeof SystemRole].toLowerCase().trim() === rRole
        );
        if (enumKey && uRole === enumKey.toLowerCase().trim()) return true;

        // 3. Fallback: If user has 'admin' and any required role contains 'admin'
        if (uRole.includes('admin') && rRole.includes('admin')) return true;

        return false;
      })
    );

    if (!hasRole) {
      console.error(`Access Denied. User roles: ${JSON.stringify(userRoles)}, Required: ${JSON.stringify(requiredRoles)}`);
      throw new ForbiddenException(
        `Access denied. Required: [${requiredRoles.join(', ')}]. Yours: [${userRoles.join(', ') || 'none'}]. Details: ${JSON.stringify({ id: user.userId || user.sub, email: user.email, role: user.role })}`,
      );
    }

    return true;
  }
}

