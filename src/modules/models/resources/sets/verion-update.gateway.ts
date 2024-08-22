import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';

import { LoggerService } from '@modules/core/logger/logger.service';
import { SetsService } from './sets.service';
import { RiotDDragonService } from '@modules/infrastructure/external-api/riot-ddragon/riot-ddragon.service';
import { EnumLanguage } from '@ts/enums/language';
import { TraitsService } from '../traits/traits.service';
import { CommunityDDragonService } from '@modules/infrastructure/external-api/community-ddragon/community-ddragon.service';
import { Version } from './entities/versions.entity';

@WebSocketGateway(2000, {
  namespace: 'version-update',
  path: '/',
  cors: { origin: process.env.CORS_ORIGIN, credentials: true },
})
export class VersionUpdateGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly logger: LoggerService,
    private readonly setsService: SetsService,
    private readonly riotDDragonService: RiotDDragonService,
    private readonly communityDDragonService: CommunityDDragonService,
    private readonly traitService: TraitsService,
  ) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.debug('Initialized');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.info(`Client id: ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    this.logger.info(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('fetch')
  async handleMessage(
    @MessageBody('versionFetch') versionFetch: string,
    @MessageBody('mapVersion') mapVersion: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.info(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${versionFetch}`);
    const version = await this.setsService.findVersion(versionFetch);
    if (!version) {
      this.logger.error('Version not found');
      throw new WsException('Version not found');
    }

    // check Trait
    const promiseTraitRiotArr = [];
    const promiseCommunityArr = [];

    Object.values(EnumLanguage).forEach((lang) => {
      promiseTraitRiotArr.push(
        this.riotDDragonService.getTrait({
          version: versionFetch,
          language: lang,
        }),
      );
      promiseCommunityArr.push(
        this.communityDDragonService.getDDraggonData({
          version: versionFetch.split('.').slice(0, 2).join('.'),
          language: lang.toLowerCase(),
        }),
      );
    });
    const resultsRiotTraits = (await Promise.all(promiseTraitRiotArr)).map(
      (traitRiot) => Object.values(traitRiot.data),
    );
    const communityDDragons = await Promise.all(promiseCommunityArr);
    const trais = {};
    const communityDDragon = {};
    Object.values(EnumLanguage).forEach((lang, index) => {
      trais[lang] = resultsRiotTraits[index];
      communityDDragon[lang] = communityDDragons[index];
    });
    const traitsDTO = [];

    Object.values(EnumLanguage).forEach((lang) => {
      const traits = trais[lang];
      const communityTraitsData = communityDDragon[lang].setData.find(
        (el) => el.number === version.set.ordinal,
      ).traits;
      traits.forEach((trait) => {
        const thisCommunityTraitData = communityTraitsData.find(
          (el) => el.apiName === trait.id,
        );

        traitsDTO.push({
          riotId: trait.id,
          name: trait.name,
          image: `/assets/set${version.set.ordinal}/trait/${trait.id}.png`,
          language: lang,
          version,
          desc: thisCommunityTraitData?.desc ?? '',
          effects: thisCommunityTraitData?.effects,
          riotImagPath: trait.image.full,
        });
      });
    });
    const promiseSaveTraits = [];

    traitsDTO.forEach((trait) =>
      promiseSaveTraits.push(this.saveTrait(trait, version, versionFetch)),
    );
    await Promise.all(promiseSaveTraits);
    this.io.emit('test', traitsDTO);

    // console.log(testt);

    // if(version.set.versions.length)
    // check Champion

    // check Augment

    // check Item

    // check Queues

    // Region Portal

    // Hero Augment

    // Charm

    // check bổ sung Arena

    //  check bổ sung Regalia

    // check bổ sung Taticians

    client.disconnect();
  }

  private async saveTrait(trait, version: Version, versionFetch: string) {
    const traitImagePath = path.join(
      __dirname,
      '..',
      'assets',
      'set' + version.set.ordinal,
      'trait',
      trait.riotImagPath,
    );
    const traitImageDir = path.join(
      __dirname,
      '..',
      'assets',
      'set' + version.set.ordinal,
      'trait',
    );
    const existed = fs.existsSync(traitImagePath);
    const dirExists = fs.existsSync(traitImageDir);
    if (!dirExists) {
      fs.mkdirSync(traitImageDir, { recursive: true });
    }
    if (!existed) {
      try {
        const traitImageBuffer = await this.riotDDragonService.getTraitImage({
          version: versionFetch,
          imagePath: trait.riotImagPath,
        });
        fs.writeFileSync(traitImagePath, traitImageBuffer);
      } catch (e) {
        if (e.message === 'Riot DDragon API is not available') {
          return;
        }
        throw new WsException(e.message);
      }
    }
    await this.traitService.createTraits(trait).catch((e) => {
      if (e.message === 'Trait existed') {
        return;
      }
      throw new WsException(e.message);
    });
  }
}
