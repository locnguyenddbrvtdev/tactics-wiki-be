import { IS_OPTIONAL_KEY } from '@decorators/jwt-auth';
import { User } from '@modules/models/users/enitities/users.entity';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { access_token_public_key } from 'src/constraints/jwt.constraint';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
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

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const jwtToken = this.extractTokenFromHeader(
      context.switchToHttp().getRequest(),
    );
    const isOptional = this.reflector.get<boolean>(
      IS_OPTIONAL_KEY,
      context.getHandler(),
    );
    if (isOptional && !jwtToken) return true;
    if (isOptional && !!jwtToken) {
      try {
        this.jwtService.verify(jwtToken, {
          algorithms: ['RS256'],
          secret: access_token_public_key,
        });
      } catch (e) {
        return true;
      }
    }
    return super.canActivate(context);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
