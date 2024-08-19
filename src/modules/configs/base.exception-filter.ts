import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { IResponse } from '@ts/interfaces/response.interface';
import { Request, Response } from 'express';

@Catch(HttpException)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      isSucess: false,
      message: exception.message,
      data: null,
      path: request.url,
      timestamp: new Date(),
    } as IResponse<null>);
  }
}
