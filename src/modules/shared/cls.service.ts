import { Injectable } from '@nestjs/common';
import { ClsService as NestJSClsService } from 'nestjs-cls';

import { IRequest } from '@ts/interfaces/req.interface';

@Injectable()
export class ClsService {
  constructor(private readonly clsService: NestJSClsService) {}

  setReq(req: Request) {
    this.clsService.set('req', req);
  }

  getReq(): IRequest {
    return this.clsService.get('req');
  }
}
