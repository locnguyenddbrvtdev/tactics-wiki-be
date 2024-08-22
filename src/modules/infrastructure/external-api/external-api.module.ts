import { Module } from '@nestjs/common';

import { RiotDDragonModule } from './riot-ddragon/riot-ddragon.module';
import { CommunityDDragonModule } from './community-ddragon/community-ddragon.module';

@Module({ imports: [RiotDDragonModule, CommunityDDragonModule] })
export class ExternalApiModule {}
