import { FindOptionsWhere, Repository } from 'typeorm';

import { SoftDeleteEntity } from './soft-delete.base.entity';

export interface BaseRepoInterface<T> {
  findOneByCondition(
    condition: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<T>;
}

export abstract class SoftDeleteRespo<T extends SoftDeleteEntity>
  implements BaseRepoInterface<T>
{
  protected constructor(private readonly repo: Repository<T>) {
    this.repo = repo;
  }

  async findOneByCondition(
    condition: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<T> {
    const result = await this.repo.findOne({ where: condition, select: [] });
    delete result.deletedAt;
    return result;
  }
}
