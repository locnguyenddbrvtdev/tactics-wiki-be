import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }
}
