import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { User } from '@modules/models/users/enitities/users.entity';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('refresh-token') {
  constructor(private reflector: Reflector) {
    super();
  }
  handleRequest<TUser = User>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Validate token failed');
    }
    return user;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
