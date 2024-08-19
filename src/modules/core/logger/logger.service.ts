import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { LoggerInterface } from '@ts/interfaces/logger.interface';

@Injectable()
export class LoggerService implements LoggerInterface {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  info(message: string): void {
    this.logger.info(message);
  }

  reqInfo(reqId: string): void {
    this.logger.info(`Request ID: ${reqId}`, { metaData: reqId });
  }
}
