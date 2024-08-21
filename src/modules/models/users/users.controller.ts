import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateRoleDTO } from './dtos/update-role.dto';
import { JwtSuperAdminAuth } from '@decorators/jwt-auth';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
    // TODO: send email or sms to verify email or phone number
  }

  @Patch('role')
  @JwtSuperAdminAuth()
  @ApiOperation({ summary: 'Update user role' })
  @HttpCode(HttpStatus.OK)
  async updateRole(@Body() body: UpdateRoleDTO) {
    await this.userService.updateRole(body.userId, body.role);
  }
}
