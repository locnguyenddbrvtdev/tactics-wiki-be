import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVersionDTO {
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 1,
  })
  setOrdinal: number;

  @IsString()
  @ApiProperty({
    type: String,
    example: '5.5',
  })
  version: string;

  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isPBE: boolean;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Date,
    example: '2021-09-01T00:00:00.000Z',
  })
  startAt?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Date,
    example: '2021-09-01T00:00:00.000Z',
  })
  endAt?: Date;
}
