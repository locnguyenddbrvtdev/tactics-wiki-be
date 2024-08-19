import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigsModule } from '@modules/configs/configs.module';
import { CoreModule } from '@modules/core/core.module';
import { AppMiddleware } from '@app.middleware';
import { ModelsModule } from '@modules/models/models.module';
import { AuthModule } from '@modules/auth/auth.module';
import { SharedModule } from '@modules/shared/shared.module';

@Module({
  imports: [ConfigsModule, CoreModule, SharedModule, AuthModule, ModelsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
