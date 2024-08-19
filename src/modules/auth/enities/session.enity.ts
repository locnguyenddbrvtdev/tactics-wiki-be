import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@modules/models/users/enitities/users.entity';

@Entity({ name: 'sessions' })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column({ type: 'text' })
  userAgent: string;

  @Column({ type: 'text' })
  ip: string;

  @Column({ type: 'text' })
  currRefreshToken: string;

  @Column({ type: 'jsonb' })
  oldRefreshToken: string[];

  @Column({ type: 'bigint' })
  expiredAt: number;

  @Column({ type: 'bigint' })
  loginedAt: number;

  @Column({ type: 'bigint', nullable: true })
  logoutedAt: number;

  @Column({ type: 'bigint' })
  latestActiveAt: number;
}
