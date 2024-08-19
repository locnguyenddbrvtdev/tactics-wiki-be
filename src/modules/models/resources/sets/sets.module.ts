import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Set } from './entities/sets.enitity';
import { Version } from './entities/versions.entity';
import { VersionUpdate } from './entities/version-update-info.entity';
import { SetsController } from './sets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Set, Version, VersionUpdate])],
  controllers: [SetsController],
})
export class SetsModule {}
