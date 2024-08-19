import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import winstonOption from '@modules/configs/logger.config';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [WinstonModule.forRoot(winstonOption)],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
