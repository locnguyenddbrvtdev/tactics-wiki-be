import { Column, Entity, ManyToOne } from 'typeorm';

import { Resource } from '@modules/models/resources/entities/resources.enity';
import { Version } from '@modules/models/resources/sets/entities/versions.entity';

import { EnumItemType } from '@ts/enums/item';

export class ItemStats {
  AD?: number; // percent
  AP?: number;
  AS?: number; // percent
  Armor?: number;
  MagicResist?: number;
  Mana?: number;
  Health?: number;
  CriptChance?: number; // percent
}

@Entity({ name: 'items' })
export class Item extends Resource {
  @ManyToOne(() => Version, (version) => version.augments)
  version: Version;

  @Column({ type: 'boolean', default: false })
  unique: boolean;

  @Column({ type: 'text' })
  desc: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'jsonb', default: [] })
  composition: string[];

  @Column({ type: 'jsonb', default: {} })
  stats: ItemStats;

  @Column({ type: 'jsonb', default: {} })
  effects: object;

  @Column({ type: 'boolean', default: false })
  isHidden: boolean;

  @Column({ type: 'enum', enum: Object.values(EnumItemType), nullable: true })
  type: EnumItemType | null;

  @Column({ type: 'text', nullable: true })
  trait: string | null;

  @Column({ type: 'text', nullable: true })
  basicItem: string | null;
}
