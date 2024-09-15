import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/items.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
  ) {}

  async createItems(dto: any) {
    const existedItem = await this.itemRepo.findOne({
      where: {
        riotId: dto.riotId,
        version: dto.version,
        language: dto.language,
      },
    });
    if (existedItem) {
      throw new Error('Item existed');
    }
    return await this.itemRepo.save(dto);
  }
}
