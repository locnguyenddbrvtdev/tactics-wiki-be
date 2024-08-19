import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Item } from './entities/items.entity';

@Module({ imports: [TypeOrmModule.forFeature([Item])] })
export class ItemsModule {}
