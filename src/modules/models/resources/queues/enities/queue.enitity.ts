import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Resource } from '@modules/models/resources/entities/resources.enity';
import { Version } from '@modules/models/resources/sets/entities/versions.entity';

@Entity({ name: 'queues' })
export class Queue extends Resource {
  @OneToOne(() => Version)
  @JoinColumn()
  version: Version;

  @Column({ type: 'text' })
  queueType: string;

  @Column({ type: 'text' })
  image: string;
}
