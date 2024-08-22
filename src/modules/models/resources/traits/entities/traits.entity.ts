import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Champion } from '@modules/models/resources/champions/entities/champions.enity';

import { Resource } from '@modules/models/resources/entities/resources.enity';
import { Version } from '@modules/models/resources/sets/entities/versions.entity';

@Entity({ name: 'traits' })
export class Trait extends Resource {
  @ManyToOne(() => Version, (version) => version.traits)
  version: Version;

  @ManyToMany(() => Champion, (champ) => champ.traits)
  @JoinTable()
  champions: Champion[];

  @Column({ type: 'text' })
  desc: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'jsonb', nullable: true })
  effects: {
    maxUnits: number;
    minUnits: number;
    style: number;
    variables: object;
  }[];
}
