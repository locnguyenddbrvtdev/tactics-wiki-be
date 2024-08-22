import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Set } from './entities/sets.enitity';
import { Version } from './entities/versions.entity';
import { VersionUpdate } from './entities/version-update-info.entity';
import { SetsController } from './sets.controller';
import { SetsService } from './sets.service';
import { RiotDDragonModule } from '@modules/infrastructure/external-api/riot-ddragon/riot-ddragon.module';
import { VersionUpdateGateway } from './verion-update.gateway';
import { TraitsModule } from '../traits/traits.module';
import { CommunityDDragonModule } from '@modules/infrastructure/external-api/community-ddragon/community-ddragon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Set, Version, VersionUpdate]),
    RiotDDragonModule,
    CommunityDDragonModule,
    TraitsModule,
  ],
  controllers: [SetsController],
  providers: [SetsService, VersionUpdateGateway],
})
export class SetsModule {}
