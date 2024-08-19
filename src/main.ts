import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction, json, urlencoded } from 'express';
import helmet from 'helmet';
import * as express from 'express';
import * as path from 'path';
import { WinstonModule } from 'nest-winston';

import { swaggerConfig } from '@modules/configs/swagger.config';
import winstonOption from '@modules/configs/logger.config';
import { LoggerService } from '@modules/core/logger/logger.service';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
    logger: WinstonModule.createLogger(winstonOption),
  });
  const configService = app.get(ConfigService);
  const origins = configService.get<string>('cors.origins');
  const port = configService.get<number>('port');

  app.use(helmet());
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: origins,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
  swaggerConfig(app, 'Tactics Wiki');
  await app.listen(port).then(() => {
    app
      .get(LoggerService)
      .debug(`Server is running on http://localhost:${port}`);
  });
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
