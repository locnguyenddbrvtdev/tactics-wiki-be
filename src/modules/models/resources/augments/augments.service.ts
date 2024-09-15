import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Augment } from './entities/augments.entity';
import { Repository } from 'typeorm';
import { EnumLanguage } from '@ts/enums/language';
import { Version } from '../sets/entities/versions.entity';

@Injectable()
export class AugmentsService {
  constructor(
    @InjectRepository(Augment)
    private readonly augmentRepo: Repository<Augment>,
  ) {}

  async findAugment(dto: {
    riotId: string;
    lang: EnumLanguage;
    version: Version;
  }) {
    return await this.augmentRepo.findOne({
      where: {
        riotId: dto.riotId,
        version: dto.version,
        language: dto.lang,
      },
    });
  }

  async createAugments(dto: any) {
    return await this.augmentRepo.save(dto);
  }
}
