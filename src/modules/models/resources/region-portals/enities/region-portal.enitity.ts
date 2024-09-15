import { Column, Entity, ManyToOne } from 'typeorm';

import { Resource } from '@modules/models/resources/entities/resources.enity';
import { Version } from '@modules/models/resources/sets/entities/versions.entity';

@Entity({ name: 'region-portals' })
export class RegionPortal extends Resource {
  @ManyToOne(() => Version, (version) => version.regionPortal)
  version: Version;

  @Column({ type: 'text' })
  desc: string;

  @Column({ type: 'text' })
  image: string;
}
