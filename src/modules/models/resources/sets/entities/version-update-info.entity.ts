import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Version } from './versions.entity';

export type TypeVersionUpdateStatus = 'buff' | 'neft' | 'adjust';

@Entity({ name: 'version-update' })
export class VersionUpdate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Version)
  @JoinColumn()
  oldVersion: Version;

  @OneToOne(() => Version)
  @JoinColumn()
  newVersion: Version;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'jsonb' })
  champions: { riotId: string; status: TypeVersionUpdateStatus }[];

  @Column({ type: 'jsonb' })
  items: { riotId: string; status: TypeVersionUpdateStatus }[];

  @Column({ type: 'jsonb' })
  traits: { riotId: string; status: TypeVersionUpdateStatus }[];

  @Column({ type: 'jsonb' })
  augments: { riotId: string; status: TypeVersionUpdateStatus }[];
}
