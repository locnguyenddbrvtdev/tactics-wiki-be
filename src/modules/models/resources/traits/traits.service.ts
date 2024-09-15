import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Trait } from './entities/traits.entity';
import { EnumLanguage } from '@ts/enums/language';
import { Version } from '../sets/entities/versions.entity';

@Injectable()
export class TraitsService {
  constructor(
    @InjectRepository(Trait) private readonly traitRepo: Repository<Trait>,
  ) {}

  async findTrait(dto: {
    riotId: string;
    lang: EnumLanguage;
    version: Version;
  }) {
    return await this.traitRepo.findOne({
      where: {
        riotId: dto.riotId,
        version: dto.version,
        language: dto.lang,
      },
    });
  }

  async createTraits(dto: any) {
    return await this.traitRepo.save(dto);
  }

  async findForChampFetch({
    name,
  }: {
    name: string;
    version: Version;
    language: EnumLanguage;
  }) {
    const trait = await this.traitRepo.findOne({ where: { name } });
    return trait;
  }
}
