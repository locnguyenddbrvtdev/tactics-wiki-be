import { Module } from '@nestjs/common';
import { HttpModule as HttpModuleAxios } from '@nestjs/axios';

import { RiotDDragonService } from './riot-ddragon.service';

@Module({
  imports: [
    HttpModuleAxios.register({
      baseURL: process.env.RIOT_DDRAGON_BASE_URL,
      timeout: parseInt(process.env.EXTERNAL_API_TIMEOUT, 10) || 3000,
    }),
  ],
  providers: [RiotDDragonService],
  exports: [RiotDDragonService],
})
export class RiotDDragonModule {}
