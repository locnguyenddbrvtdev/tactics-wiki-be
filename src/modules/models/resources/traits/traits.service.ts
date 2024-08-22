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

  async createTraits(dto: {
    riotId: string;
    name: string;
    language: EnumLanguage;
    version: Version;
    desc: string;
    image: string;
  }) {
    const existedTrait = await this.traitRepo.findOne({
      where: {
        riotId: dto.riotId,
        version: dto.version,
        language: dto.language,
      },
    });
    if (existedTrait) {
      throw new Error('Trait existed');
    }
    return await this.traitRepo.save(dto);
  }
}
