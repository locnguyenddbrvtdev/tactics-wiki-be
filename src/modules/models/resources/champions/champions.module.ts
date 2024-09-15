import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Champion } from './entities/champions.enity';
import { ChampionService } from './champions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Champion])],
  providers: [ChampionService],
  exports: [ChampionService],
})
export class ChampionsModule {}
