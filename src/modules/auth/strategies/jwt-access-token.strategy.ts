import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { access_token_public_key } from 'src/constraints/jwt.constraint';
import { ITokenPayload } from '@ts/interfaces/tokens.interface';
import { AuthService } from '../auth.service';
import { IRequest } from '@ts/interfaces/req.interface';

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

  async validate(req: IRequest, payload: ITokenPayload) {
    try {
      const sessionId = payload.sessionId;
      const { user, session } =
        await this.authService.authenticateJwtAccessToken(sessionId);
      req.session = session;
      return user;
    } catch (e) {
      if (e.message === 'Invalid session') {
        throw new UnauthorizedException('Unauthorized');
      }
    }
  }
}
