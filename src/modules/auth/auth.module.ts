import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@modules/models/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { Session } from './enities/session.enity';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategies';
import { VerifyEmailSchema } from './schemas/verify-email.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    MongooseModule.forFeature([
      { name: 'verify-email', schema: VerifyEmailSchema },
    ]),
    JwtModule.register({ signOptions: { algorithm: 'RS256' }, global: true }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AuthModule {}
