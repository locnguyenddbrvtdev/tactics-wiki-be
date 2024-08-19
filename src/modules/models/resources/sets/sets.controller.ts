import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Sets')
@Controller('sets')
export class SetsController {
  constructor() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all sets' })
  async getAllSets() {}

  @Post('version')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new version of a set' })
  async createNewVersion() {}
}
