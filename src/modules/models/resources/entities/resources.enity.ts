import { Column, PrimaryGeneratedColumn } from 'typeorm';

import { EnumLanguage } from '@ts/enums/language';

export abstract class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  riotId: string;

  @Column({ type: 'enum', enum: Object.values(EnumLanguage) })
  language: EnumLanguage;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
