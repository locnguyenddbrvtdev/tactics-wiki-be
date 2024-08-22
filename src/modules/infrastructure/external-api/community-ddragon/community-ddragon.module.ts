import { Module } from '@nestjs/common';
import { HttpModule as HttpModuleAxios } from '@nestjs/axios';

import { CommunityDDragonService } from './community-ddragon.service';

@Module({
  imports: [
    HttpModuleAxios.register({
      baseURL: process.env.COMMUNITY_DDRAGON_BASE_URL,
      timeout: parseInt(process.env.EXTERNAL_API_TIMEOUT, 10) || 3000,
    }),
  ],
  providers: [CommunityDDragonService],
  exports: [CommunityDDragonService],
})
export class CommunityDDragonModule {}
