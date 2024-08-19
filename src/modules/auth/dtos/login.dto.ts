import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  @ApiProperty({ example: 'usernameOrEmail', type: String })
  usernameOrEmail: string;

  @IsString()
  @ApiProperty({ example: 'password', type: String })
  password: string;
}
