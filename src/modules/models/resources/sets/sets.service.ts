import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Set } from './entities/sets.enitity';
import { Version } from './entities/versions.entity';
import { CreateVersionDTO } from './dtos/create-version.dto';
import { ClsService } from '@modules/shared/cls.service';
import { RiotDDragonService } from '@modules/infrastructure/external-api/riot-ddragon/riot-ddragon.service';
import { EnumLanguage } from '@ts/enums/language';

@Injectable()
export class SetsService {
  constructor(
    private readonly clsService: ClsService,
    private readonly riotDDragonService: RiotDDragonService,
    @InjectRepository(Set) private readonly setRepository: Repository<Set>,
    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,
  ) {}

  async inittialSets() {
    await this.setRepository.save([
      ...Array.from({ length: 10 }).map((_, i) => ({
        ordinal: i + 1,
        mutator: 'TFTSet' + (i + 1),
        name: { en: 'Set ' + (i + 1), vi_VN: 'Mùa ' + (i + 1) },
        isPublished: false,
      })),
      {
        ordinal: 11,
        mutator: 'TFTSet11',
        name: { en: 'Set 11', vi_VN: 'Hoạ Thế Chi Linh' },
        isPublished: false,
      },
      {
        ordinal: 12,
        mutator: 'TFTSet12',
        name: { en: 'Set 12', vi_VN: 'Hoạ Thế Chi' },
        isPublished: true,
      },
    ]);
  }

  async findVersion(version: string) {
    return this.versionRepository.findOne({
      where: { name: version },
      relations: ['set'],
    });
  }

  async createVersion(dto: CreateVersionDTO) {
    const user = this.clsService.getReq().user;
    const existedSet = await this.setRepository.findOne({
      where: { ordinal: dto.setOrdinal },
      relations: ['versions'],
    });
    if (!existedSet) {
      throw new NotFoundException('Set not found');
    }
    const existedVersion = await this.versionRepository.findOne({
      where: { name: dto.version },
    });
    if (existedVersion) {
      throw new ConflictException('Version existed');
    }
    const versionListFromRiot = await this.riotDDragonService.getVersionsList();
    if (!versionListFromRiot.includes(dto.version)) {
      throw new ForbiddenException('Version not found in Riot Version List');
    }
    await this.versionRepository.save({
      set: existedSet,
      name: dto.version,
      isPBE: dto.isPBE,
      startAt: dto.startAt ?? new Date(),
      endAt: dto.endAt ?? null,
    });
  }
}
