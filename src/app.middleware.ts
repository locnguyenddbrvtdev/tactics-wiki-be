import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { LoggerService } from '@modules/core/logger/logger.service';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // this.loggerService.reqInfo(req.originalUrl);
    next();
  }
}
