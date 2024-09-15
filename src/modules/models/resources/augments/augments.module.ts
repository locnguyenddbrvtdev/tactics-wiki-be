import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Augment } from './entities/augments.entity';
import { AugmentsService } from './augments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Augment])],
  providers: [AugmentsService],
  exports: [AugmentsService],
})
export class AugmentsModule {}
