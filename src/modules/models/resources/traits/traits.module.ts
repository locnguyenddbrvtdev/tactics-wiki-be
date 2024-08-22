import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Trait } from './entities/traits.entity';
import { TraitsService } from './traits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trait])],
  providers: [TraitsService],
  exports: [TraitsService],
})
export class TraitsModule {}
