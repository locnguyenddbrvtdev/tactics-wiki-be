import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Champion } from './entities/champions.enity';

@Module({ imports: [TypeOrmModule.forFeature([Champion])] })
export class ChampionsModule {}
