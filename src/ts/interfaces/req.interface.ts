import { Session } from '@modules/auth/enities/session.enity';
import { User } from '@modules/models/users/enitities/users.entity';
import { Request } from 'express';

export interface IRequest extends Request {
  user?: User;
  session?: Session;
}
