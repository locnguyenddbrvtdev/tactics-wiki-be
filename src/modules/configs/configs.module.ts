import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import configurations from './configuration';
import { BaseInterceptor } from './base.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configurations],
      envFilePath: [
        '.env.local',
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      ],
      expandVariables: true,
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: BaseInterceptor }],
})
export class ConfigsModule {}
