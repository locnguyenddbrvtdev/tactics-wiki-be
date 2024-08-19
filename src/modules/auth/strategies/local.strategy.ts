import { Strategy } from 'passport-local';
import * as _ from 'lodash';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import {
  Injectable,
  Dependencies,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'usernameOrEmail', passReqToCallback: true });
  }

  async validate(req: Request, usernameOrEmail: string, password: string) {
    try {
      const user = await this.authService.authenticateLogin(
        usernameOrEmail,
        password,
      );
      if (!user.isVerifiedEmail && !user.isVerifiedPhoneNumber) {
        throw new Error('Not verified');
      }
      return user;
    } catch (e) {
      if (e.message === 'Invalid credentials' || e.message === 'Not matching') {
        throw new UnauthorizedException('Invalid credentials');
      }
      if (e.message === 'Not verified') {
        throw new ForbiddenException('Not verified');
      }
    }
  }
}
