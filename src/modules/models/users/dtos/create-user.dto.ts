import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email của người dùng',
    example: 'email@gmail.com',
  })
  email: string;

  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @ApiProperty({
    type: String,
    description: 'Tên người dùng',
    example: 'Nguyễn Văn A',
  })
  name: string;

  @IsString()
  @MaxLength(32)
  @MinLength(8)
  @ApiProperty({
    type: String,
    description: 'Mật khẩu của người dùng',
    example: 'password',
  })
  password: string;
}
