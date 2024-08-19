import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Trait } from './entities/traits.entity';

@Module({ imports: [TypeOrmModule.forFeature([Trait])] })
export class TraitsModule {}
