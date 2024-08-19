import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { LoggerService } from '@modules/core/logger/logger.service';
import { IResponse } from '@ts/interfaces/response.interface';
import { ClsService } from '@modules/shared/cls.service';

@Injectable()
export class BaseInterceptor implements NestInterceptor {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly clsService: ClsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    this.clsService.setReq(request);
    return next
      .handle()
      .pipe(
        tap(() =>
          this.loggerService.info(`Response time: ${Date.now() - now}ms`),
        ),
      )
      .pipe(
        map(
          (data) =>
            ({
              statusCode: request.statusCode,
              isSucess: true,
              message: 'Successfully',
              data: data ?? null,
              path: request.url,
              timestamp: new Date(),
            }) as IResponse<typeof data>,
        ),
      );
  }
}
