import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Augment } from './entities/augments.entity';

@Module({ imports: [TypeOrmModule.forFeature([Augment])] })
export class AugmentsModule {}
