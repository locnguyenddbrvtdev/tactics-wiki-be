import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './enitities/users.entity';
import { CreateUserDTO } from './dtos/create-user.dto';

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

  async verifiedEmail(id: number) {
    await this.userRepository.update({ id }, { isVerifiedEmail: true });
  }

  async create(user: CreateUserDTO) {
    const { password, email, name } = user;
    const existedEmail = await this.findOneByEmail(email);
    if (existedEmail) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.save({
      email,
      name,
      password: hashedPassword,
      username: email.split('@')[0] + Date.now(),
    });
  }
}
