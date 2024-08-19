import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Version } from './versions.entity';
import { EnumLanguage } from '@ts/enums/language';

@Entity({ name: 'sets' })
export class Set {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer', unique: true })
  ordinal: number;

  @Column({ type: 'varchar', length: 255 })
  mutator: string;

  @Column({ type: 'jsonb' })
  name: { [key in keyof typeof EnumLanguage]: string };

  @OneToMany(() => Version, (version) => version.set)
  versions: Version[];

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;
}
