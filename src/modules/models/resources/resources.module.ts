import { Module } from '@nestjs/common';

import { SetsModule } from './sets/sets.module';
import { ChampionsModule } from './champions/champions.module';
import { TraitsModule } from './traits/traits.module';
import { AugmentsModule } from './augments/augments.module';
import { ItemsModule } from './items/items.module';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [
    SetsModule,
    ChampionsModule,
    TraitsModule,
    AugmentsModule,
    ItemsModule,
    QueuesModule,
  ],
})
export class ResourcesModule {}
