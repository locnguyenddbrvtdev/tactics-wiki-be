import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Set } from './sets.enitity';
import { VersionUpdate } from './version-update-info.entity';
import { Champion } from '@modules/models/resources/champions/entities/champions.enity';
import { Trait } from '@modules/models/resources/traits/entities/traits.entity';
import { Augment } from '../../augments/entities/augments.entity';
import { Item } from '../../items/entities/items.entity';
import { Queue } from '../../queues/enities/queue.enitity';

@Entity({ name: 'versions' })
export class Version {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Set, (set) => set.versions)
  set: Set;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean', default: false })
  isPBE: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endAt: Date;

  @OneToOne(() => VersionUpdate, { nullable: true })
  preUpdate: VersionUpdate;

  @OneToOne(() => VersionUpdate, { nullable: true })
  nextUpdate: VersionUpdate;

  @OneToOne(() => Queue, { nullable: false })
  queue: Queue;

  @OneToMany(() => Champion, (champion) => champion.version)
  champions: Champion[];

  @OneToMany(() => Trait, (trait) => trait.version)
  traits: Trait[];

  @OneToMany(() => Augment, (augment) => augment.version)
  augments: Augment[];

  @OneToMany(() => Item, (item) => item.version)
  items: Item[];
}
