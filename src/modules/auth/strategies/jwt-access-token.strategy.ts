import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { access_token_public_key } from 'src/constraints/jwt.constraint';
import { IRequesetUser, JWTTokenPayload } from 'src/interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: access_token_public_key,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JWTTokenPayload) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const sessionId = payload.sessionId;
    const user = await this.authService
      .authenticateUserBySessionId(sessionId, userAgent, ip)
      .catch((e) => {
        e.message && console.log(e.message);
        if (e.name === 'Error' && e.message === 'Session not found') {
          throw new UnauthorizedException('Session invalid');
        }
        if (e.name === 'Error' && e.message === 'Session is not logged in') {
          throw new UnauthorizedException('Session is not logged in');
        }
        if (e.name === 'Error' && e.message === 'Session is expired') {
          throw new UnauthorizedException(
            'Session is expired, pls login again',
          );
        }
        if (e.name === 'Error' && e.message === 'UA is not matching') {
          throw new UnauthorizedException('Session invalid');
        }

        throw e;
      });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarPath: user.avatarPath,
      isAdmin: user.isAdmin,
      googleId: user.googleId,
      sessionId,
    } as IRequesetUser;
  }
}
