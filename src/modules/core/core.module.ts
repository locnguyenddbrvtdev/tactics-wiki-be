import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [DbModule, LoggerModule],
})
export class CoreModule {}
