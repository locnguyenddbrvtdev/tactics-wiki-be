import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { User } from '@modules/models/users/enitities/users.entity';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: undefined | User = req.user;
    if (!user) {
      throw new ForbiddenException(
        'Need Authenticated User to access this route',
      );
    }
    if (!user.isSuperAdmin || !user.isAdmin) {
      throw new ForbiddenException('You are not allowed to access this route');
    }
    return true;
  }
}
