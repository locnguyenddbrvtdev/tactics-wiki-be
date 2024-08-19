import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import {
  Injectable,
  Dependencies,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { AuthService } from '../auth.service';
import { LanguageCode } from 'src/modules/resource/enities/language.entity';
import { IRequesetUser } from 'src/interfaces';

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(req: Request, email: string, password: string) {
    const lang: LanguageCode = req.params.lang as LanguageCode;

    const user = await this.authService
      .getAuthenticatedUser(email, password)
      .catch((e) => {
        if (e.name === 'Error' && e.message === 'Password is not matching') {
          switch (lang) {
            case LanguageCode.EN:
              throw new UnauthorizedException(
                'Login Information is not correct',
              );
            case LanguageCode.VI:
              throw new UnauthorizedException(
                'Thông tin đăng nhập không chính xác',
              );
            default:
              throw new UnauthorizedException(
                'Login Information is not correct',
              );
          }
        }
        if (e.name === 'Error' && e.message === 'User not found') {
          switch (lang) {
            case LanguageCode.EN:
              throw new UnauthorizedException(
                'Login Information is not correct',
              );
            case LanguageCode.VI:
              throw new UnauthorizedException(
                'Thông tin đăng nhập không chính xác',
              );
            default:
              throw new UnauthorizedException(
                'Login Information is not correct',
              );
          }
        }
        throw e;
      });
    await this.authService.checkValidatedEmail(email).catch((e) => {
      if (e.name === 'Error' && e.message === 'Email is not validated') {
        switch (lang) {
          case LanguageCode.EN:
            throw new ForbiddenException('Email is not validated');
          case LanguageCode.VI:
            throw new ForbiddenException('Email chưa được xác thực');
          default:
            throw new ForbiddenException('Email is not validated');
        }
      }
      throw e;
    });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarPath: user.avatarPath,
      isAdmin: user.isAdmin,
    } as IRequesetUser;
  }
}
