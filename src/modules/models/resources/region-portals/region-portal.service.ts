import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionPortal } from './enities/region-portal.enitity';
import { Repository } from 'typeorm';

@Injectable()
export class RegionPortalService {
  constructor(
    @InjectRepository(RegionPortal)
    private readonly regionPortalRepo: Repository<RegionPortal>,
  ) {}

  create(dto: any) {
    const existed = this.regionPortalRepo.findOne({
      where: {
        riotId: dto.riotId,
        version: dto.version,
        language: dto.language,
      },
    });
    if (existed) {
      throw new Error('Region portal existed');
    }
    return this.regionPortalRepo.save(dto);
  }
}
