import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Champion } from './entities/champions.enity';
import { EnumLanguage } from '@ts/enums/language';
import { Version } from '../sets/entities/versions.entity';

@Injectable()
export class ChampionService {
  constructor(
    @InjectRepository(Champion)
    private readonly championRepo: Repository<Champion>,
  ) {}

  async findChampion(dto: {
    riotId: string;
    lang: EnumLanguage;
    version: Version;
  }) {
    return await this.championRepo.findOne({
      where: {
        riotId: dto.riotId,
        version: dto.version,
        language: dto.lang,
      },
    });
  }

  async createChamps(dto: any) {
    return await this.championRepo.save(dto);
  }

  // async createChampions(dto: any) {
  //   const existedChampion = await this.championRepo.findOne({
  //     where: {
  //       riotId: dto.riotId,
  //       version: dto.version,
  //       language: dto.language,
  //     },
  //   });
  //   if (existedChampion) {
  //     throw new Error('Champion existed');
  //   }
  //   return await this.championRepo.save(dto);
  // }
}
