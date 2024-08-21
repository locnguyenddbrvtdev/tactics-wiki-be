import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

// import { EnumUserRole } from '@ts/enums/user';

export enum EnumUserRoleDTO {
  ADMIN = 'admin',
  USER = 'user',
}

export class UpdateRoleDTO {
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'ID của người dùng',
    example: 1,
  })
  userId: number;

  @IsString()
  @IsEnum(EnumUserRoleDTO)
  @ApiProperty({
    type: String,
    enum: EnumUserRoleDTO,
    description: 'Vai trò mới của người dùng',
    example: 'admin',
  })
  role: EnumUserRoleDTO;
}
