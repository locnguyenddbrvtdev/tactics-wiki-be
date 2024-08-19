import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { SoftDeleteEntity } from '@base/soft-delete.base.entity';
import { Session } from '@modules/auth/enities/session.enity';

@Entity({ name: 'users', orderBy: { id: 'ASC' } })
export class User extends SoftDeleteEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  avatarPath: string;

  @Column({ type: 'boolean', default: false })
  isVerifiedEmail: boolean;

  @Column({ type: 'boolean', default: false })
  isVerifiedPhoneNumber: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  googleId: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'boolean', default: false })
  isSuperAdmin: boolean;

  @Column({ type: 'text', nullable: true })
  gender: string | null;

  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
