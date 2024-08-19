import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './enitities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async updatePassword(id: number, newPassword: string) {
    await this.userRepository.update({ id }, { password: newPassword });
  }
}
