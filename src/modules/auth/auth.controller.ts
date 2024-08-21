import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from '@modules/models/users/enitities/users.entity';
import { JwtAuth } from '@decorators/jwt-auth';
import { IRequest } from '@ts/interfaces/req.interface';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { isEmail } from 'class-validator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request & { user: User }, @Body() body: LoginDTO) {
    return await this.authService.login(req.user);
    // 201 Created: Đăng nhập thành công { accessToken, refreshToken }
    // 409 Not verified: Cần phải xác thực email hoặc số điện thoại trước khi đăng nhập
    // 401 Invalid credentials: Thông tin đăng nhập không chính xác
  }

  @JwtAuth()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: IRequest) {
    await this.authService.logout();
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.CREATED)
  async refreshToken() {
    return await this.authService.refreshToken();
  }

  @JwtAuth()
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() body: ChangePasswordDTO) {
    await this.authService.changePassword(body);
    // TODO: Handle logout all devices

    // 401: CurrPassword is incorrect
    // 400: DTO or currPass same as newPass
  }

  @Get('forget-password/:email')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Param('email') email: string) {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email');
    }
    await this.authService.forgetPassword(email);
  }

  @Get('verify-email/:email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Param('email') email: string) {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email');
    }
    await this.authService.sendVerifyEmailUser(email);
  }

  @Post('verify-email/:code')
  @HttpCode(HttpStatus.OK)
  async verifyEmailCode(@Param('code') code: string) {
    await this.authService.verifyEmailUser(code);
  }
}
