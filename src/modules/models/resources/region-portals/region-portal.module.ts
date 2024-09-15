import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RegionPortal } from './enities/region-portal.enitity';
import { RegionPortalService } from './region-portal.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegionPortal])],
  providers: [RegionPortalService],
  exports: [RegionPortalService],
})
export class RegionPortalsModule {}
