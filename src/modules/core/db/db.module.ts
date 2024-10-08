import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from '../cache.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.postgres.host'),
        port: configService.get<number>('db.postgres.port'),
        username: configService.get<string>('db.postgres.user'),
        password: configService.get<string>('db.postgres.password'),
        database: configService.get<string>('db.postgres.name'),
        synchronize:
          configService.get<'development' | 'production'>('env') ===
          'development'
            ? true
            : false,
        migrations: ['src/migrations/*{.js}'],
        retryDelay: 3000,
        retryAttempts: 10,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>('db.mongo.host')}:${configService.get<number>('db.mongo.port')}`,
        dbName: configService.get<string>('db.mongo.name'),
        user: configService.get<string>('db.mongo.user'),
        pass: configService.get<string>('db.mongo.password'),
        autoCreate: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('db.redis.host'),
        port: configService.get<number>('db.redis.port'),
        // ttl: configService.get<number>('redis.ttl'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class DbModule {}
