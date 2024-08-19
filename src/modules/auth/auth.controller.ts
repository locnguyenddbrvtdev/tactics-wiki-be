import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(@Body() body: ChangePasswordDTO) {}
}
