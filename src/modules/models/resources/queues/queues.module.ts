import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueuesController } from './queues.controller';
import { QueuesService } from './queues.service';
import { Queue } from './enities/queue.enitity';

@Module({
  imports: [TypeOrmModule.forFeature([Queue])],
  controllers: [QueuesController],
  providers: [QueuesService],
})
export class QueuesModule {}
