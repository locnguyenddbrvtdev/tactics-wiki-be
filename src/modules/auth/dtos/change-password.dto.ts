import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @ApiProperty({ example: '12345678', type: String })
  currPassword: string;

  @IsString()
  @MaxLength(32)
  @MinLength(8)
  @ApiProperty({ example: '12345678', type: String })
  newPassword: string;
}
