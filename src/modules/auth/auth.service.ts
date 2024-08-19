import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '@modules/models/users/users.service';
import { User } from '@modules/models/users/enitities/users.entity';
import { ITokenPayload } from '@ts/interfaces/tokens.interface';
import {
  access_token_private_key,
  refresh_token_private_key,
} from '@constraints/jwt.constraint';
import { Session } from './enities/session.enity';
import { ClsService } from '@modules/shared/cls.service';
import { LoggerService } from '@modules/core/logger/logger.service';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { MailService } from '@modules/infrastructure/mail/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VerifyEmail } from './schemas/verify-email.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly clsService: ClsService,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
    private readonly loggerService: LoggerService,
    private readonly mailService: MailService,
    @InjectModel('verify-email')
    private readonly verifyEmailModel: Model<VerifyEmail>,
  ) {}

  async authenticateLogin(usernameOrEmail: string, passport: string) {
    let user: User;
    if (isEmail(usernameOrEmail)) {
      user = await this.userService.findOneByEmail(usernameOrEmail);
    }
    if (!user) {
      user = await this.userService.findOneByUsername(usernameOrEmail);
    }
    if (!user) {
      throw new Error('Invalid credentials');
    }
    await this.verifyPlainContentWithHashedContent(passport, user.password);
    return user;
  }

  async authenticateJwtAccessToken(sessionId: string) {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });
    if (
      !session ||
      (!!session && session.logoutedAt) ||
      (!!session && session.expiredAt < Date.now())
    ) {
      throw new Error('Invalid session');
    }
    await this.sessionRepo.update(
      { id: sessionId },
      { latestActiveAt: Date.now() },
    );
    const user = session.user;
    if (!user) {
      this.loggerService.error('User not found, Conflict!!');
    }
    return { user, session };
  }

  async login(user: User) {
    const req = this.clsService.getReq();
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const newSession = await this.sessionRepo.save({
      user,
      userAgent,
      ip,
      currRefreshToken: '',
      oldRefreshToken: [],
      expiredAt:
        Date.now() +
        1000 *
          60 *
          60 *
          24 *
          (parseInt(process.env.SESSION_EXPIRED_DAY, 10) ?? 14),
      loginedAt: Date.now(),
      logoutedAt: null,
      latestActiveAt: Date.now(),
    });
    const { accessToken, refreshToken } = this.generateJwtTokens({
      sessionId: newSession.id,
    });
    newSession.currRefreshToken = refreshToken;
    await this.sessionRepo.save(newSession);
    return { accessToken, refreshToken };
  }

  async authenticateRefreshToken(refreshToken: string, sessionId: string) {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });
    if (
      !session ||
      (!!session && session.logoutedAt) ||
      (!!session && session.expiredAt < Date.now())
    ) {
      throw new Error('Invalid session');
    }
    if (session.currRefreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }
    const { user } = session;
    await this.sessionRepo.update(
      { id: sessionId },
      {
        latestActiveAt: Date.now(),
        currRefreshToken: '',
        oldRefreshToken: [...session.oldRefreshToken, session.currRefreshToken],
      },
    );
    return { user, session };
  }

  async refreshToken() {
    const req = this.clsService.getReq();
    const session = req.session;
    const { accessToken, refreshToken } = this.generateJwtTokens({
      sessionId: session.id,
    });
    await this.sessionRepo.update(
      { id: session.id },
      { latestActiveAt: Date.now(), currRefreshToken: refreshToken },
    );
    return { accessToken, refreshToken };
  }

  async logout() {
    const session = this.clsService.getReq().session;
    await this.sessionRepo.update(
      { id: session.id },
      { logoutedAt: Date.now() },
    );
  }

  async changePassword(dto: ChangePasswordDTO) {
    if (dto.newPassword === dto.currPassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }
    const user = this.clsService.getReq().user;
    await this.verifyPlainContentWithHashedContent(
      dto.currPassword,
      user.password,
    ).catch(() => {
      throw new UnauthorizedException('Invalid credentials');
    });
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.userService.updatePassword(user.id, hashedNewPassword);
  }

  async forgetPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return;
    }
    const newPassword = crypto.randomBytes(16).toString('base64url');
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(user.id, hashedNewPassword);
    await this.mailService.sendRecoveryPasswordEmail(email, newPassword);
  }

  async sendVerifyEmailUser(email: string) {
    let code = crypto.randomBytes(64).toString('base64url') + Date.now();
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.verifyEmailModel.create({
      userId: user.id,
      code,
    });
    await this.mailService.sendVerifyEmail(email, code);
  }

  async verifyEmailUser(code: string) {
    const verifyEmail = await this.verifyEmailModel.findOne({ code });
    if (!verifyEmail) {
      throw new ForbiddenException('Link expired or invalid');
    }
    await this.userService.verifiedEmail(verifyEmail.userId);
    await this.verifyEmailModel.findByIdAndDelete(verifyEmail._id);
  }

  private generateJwtTokens(payload: ITokenPayload) {
    const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_JWT_EXPIRED_TIME;
    const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_JWT_EXPIRED_TIME;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      privateKey: access_token_private_key,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      privateKey: refresh_token_private_key,
    });

    return { accessToken, refreshToken };
  }

  private async verifyPlainContentWithHashedContent(
    plain_text: string,
    hashed_text: string,
  ) {
    const is_matching = await bcrypt.compare(plain_text, hashed_text);
    if (!is_matching) {
      throw new Error('Not matching');
    }
  }
}
