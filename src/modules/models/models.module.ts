import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';

@Module({ imports: [ResourcesModule, UsersModule] })
export class ModelsModule {}
