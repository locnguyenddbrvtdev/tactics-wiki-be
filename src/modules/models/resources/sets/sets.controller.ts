import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateVersionDTO } from './dtos/create-version.dto';
import { JwtAdminAuth, JwtSuperAdminAuth } from '@decorators/jwt-auth';
import { SetsService } from './sets.service';

@ApiTags('Sets')
@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all sets' })
  async getAllSets() {}

  @Post('init')
  @JwtSuperAdminAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Init all sets' })
  async initAllSets() {
    return this.setsService.inittialSets();
  }

  @Post('version')
  @JwtAdminAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new version of a set' })
  async createNewVersion(@Body() body: CreateVersionDTO) {
    return this.setsService.createVersion(body);
  }
}
