import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { refresh_token_public_key } from 'src/constraints/jwt.constraint';
import { ITokenPayload } from '@ts/interfaces/tokens.interface';
import { IRequest } from '@ts/interfaces/req.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: refresh_token_public_key,
      passReqToCallback: true,
    });
  }

  async validate(req: IRequest, payload: ITokenPayload) {
    try {
      const sessionId = payload.sessionId;
      console.log(sessionId);

      const refreshToken = this.extractTokenFromHeader(req);
      const { user, session } = await this.authService.authenticateRefreshToken(
        refreshToken,
        sessionId,
      );
      req.session = session;
      return user;
    } catch (e) {}
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
