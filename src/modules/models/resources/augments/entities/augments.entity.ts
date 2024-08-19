import { Column, Entity, ManyToOne } from 'typeorm';

import { Resource } from '@modules/models/resources/entities/resources.enity';
import { Version } from '@modules/models/resources/sets/entities/versions.entity';
import { EnumAugmentTier } from '@ts/enums/augment';

@Entity({ name: 'augments' })
export class Augment extends Resource {
  @ManyToOne(() => Version, (version) => version.augments)
  version: Version;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'text' })
  desc: string;

  @Column({ type: 'jsonb', default: [] })
  associatedTraits: string[];

  @Column({ type: 'jsonb', default: [] })
  incompatibleTraits: string[];

  @Column({ type: 'jsonb', default: {} })
  effects: object;

  @Column({ type: 'boolean', default: false })
  isHidden: boolean;

  @Column({ type: 'enum', enum: Object.values(EnumAugmentTier) })
  tier: EnumAugmentTier;
}
