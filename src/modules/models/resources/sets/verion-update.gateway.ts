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
import { ChampionService } from '../champions/champions.service';
import { AugmentsService } from '../augments/augments.service';
import { EnumAugmentTier } from '@ts/enums/augment';
import { ItemsService } from '../items/items.service';
import { RegionPortalService } from '../region-portals/region-portal.service';

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
    private readonly championService: ChampionService,
    private readonly augmentsService: AugmentsService,
    private readonly itemsService: ItemsService,
    private readonly regionPortalService: RegionPortalService,
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

  // @SubscribeMessage('fetch')
  // async handleMessage(
  // @MessageBody('versionFetch') versionFetch: string,
  // @MessageBody('mapVersion') mapVersion: string,
  // @ConnectedSocket() client: Socket,
  // ) {
  //   this.logger.info(`Message received from client id: ${client.id}`);
  //   this.logger.debug(`Payload: ${versionFetch}`);
  //   let timer = 0;
  //   const interval = setInterval(() => {
  //     client.emit('timer', timer);
  //     timer++;
  //   }, 1);
  //   const version = await this.setsService.findVersion(versionFetch);
  //   if (!version) {
  //     this.logger.error('Version not found');
  //     throw new WsException('Version not found');
  //   }
  //   const promiseCommunityArr = [];
  //   const promiseTraitRiotArr = [];
  //   const promiseChampionRiotArr = [];
  //   const promiseAugmentRiotArr = [];
  //   const promiseItemRiotArr = [];
  //   const promiseRegionPortal = [];

  //   Object.values(EnumLanguage).forEach((lang) => {
  //     promiseCommunityArr.push(
  //       this.communityDDragonService.getDDraggonData({
  //         version: versionFetch.split('.').slice(0, 2).join('.'),
  //         language: lang.toLowerCase(),
  //       }),
  //     );
  //     promiseTraitRiotArr.push(
  //       this.riotDDragonService.getTrait({
  //         version: versionFetch,
  //         language: lang,
  //       }),
  //     );
  //     promiseChampionRiotArr.push(
  //       this.riotDDragonService.getChampion({
  //         version: versionFetch,
  //         language: lang,
  //       }),
  //     );
  //     promiseAugmentRiotArr.push(
  //       this.riotDDragonService.getAugment({
  //         version: versionFetch,
  //         language: lang,
  //       }),
  //     );
  //     promiseItemRiotArr.push(
  //       this.riotDDragonService.getItem({
  //         version: versionFetch,
  //         language: lang,
  //       }),
  //     );
  //     promiseRegionPortal.push(
  //       this.riotDDragonService.getRegionPortal({
  //         version: versionFetch,
  //         language: lang,
  //       }),
  //     );
  //   });
  //   const communityDDragons = await Promise.all(promiseCommunityArr);
  //   const communityDDragon = {};

  //   const resultsRiotTraits = (await Promise.all(promiseTraitRiotArr)).map(
  //     (traitRiot) => Object.values(traitRiot.data),
  //   );
  //   const resultChampionRiot = (await Promise.all(promiseChampionRiotArr)).map(
  //     (el) => Object.values(el.data),
  //   );
  //   const resultAugmentRiot = (await Promise.all(promiseAugmentRiotArr)).map(
  //     (el) => Object.values(el.data),
  //   );
  //   const resultItemRiot = (await Promise.all(promiseItemRiotArr)).map((el) =>
  //     Object.values(el.data),
  //   );
  //   const resultRegionPortal = (await Promise.all(promiseRegionPortal)).map(
  //     (el) => Object.values(el.data),
  //   );

  //   const trais = {};
  //   const champions = {};
  //   const augments = {};
  //   const items = {};
  //   const regionPortal = {};
  //   Object.values(EnumLanguage).forEach((lang, index) => {
  //     communityDDragon[lang] = communityDDragons[index];
  //     trais[lang] = resultsRiotTraits[index];
  //     champions[lang] = resultChampionRiot[index];
  //     augments[lang] = resultAugmentRiot[index];
  //     items[lang] = resultItemRiot[index];
  //     regionPortal[lang] = resultRegionPortal[index];
  //   });

  //   // check Trait
  //   const traitsDTO = [];
  //   Object.values(EnumLanguage).forEach((lang) => {
  //     const traits = trais[lang];
  //     const communityTraitsData = communityDDragon[lang].setData.find(
  //       (el) => el.number === version.set.ordinal,
  //     ).traits;
  //     traits.forEach((trait) => {
  //       const thisCommunityTraitData = communityTraitsData.find(
  //         (el) => el.apiName === trait.id,
  //       );

  //       traitsDTO.push({
  //         riotId: trait.id,
  //         name: trait.name,
  //         image: `/assets/set${version.set.ordinal}/trait/${trait.id}.png`,
  //         language: lang,
  //         version,
  //         desc: thisCommunityTraitData?.desc ?? '',
  //         effects: thisCommunityTraitData?.effects,
  //         riotImagPath: trait.image.full,
  //       });
  //     });
  //   });
  //   const promiseSaveTraits = [];
  //   traitsDTO.forEach((trait) =>
  //     promiseSaveTraits.push(this.saveTrait(trait, version, versionFetch)),
  //   );
  //   await Promise.all(promiseSaveTraits);

  //   // check Champion
  //   const championDTO = [];
  //   const langPromises = [];
  //   Object.values(EnumLanguage).forEach((lang) => {
  //     const champPromises = [];
  //     const champs = champions[lang];
  //     const communityChampData = communityDDragon[lang].setData.find(
  //       (el) => el.number === version.set.ordinal,
  //     ).champions;
  //     champs.forEach((champ) => {
  //       champPromises.push(
  //         (async () => {
  //           const thisCommunityChampData = communityChampData.find(
  //             (el) => el.apiName === champ.id,
  //           );
  //           let championTrait = [];
  //           if (!!thisCommunityChampData?.traits) {
  //             championTrait = await Promise.all(
  //               thisCommunityChampData.traits.map(async (name) => {
  //                 const trait = await this.traitService.findForChampFetch({
  //                   name,
  //                   version,
  //                   language: lang,
  //                 });
  //                 return trait ?? undefined;
  //               }),
  //             );
  //           }
  //           const avatarImagePath = path.join(
  //             __dirname,
  //             '..',
  //             'assets',
  //             'set' + version.set.ordinal,
  //             'champion',
  //             'avatar',
  //             champ.id + '.png',
  //           );
  //           const existedChampionAvatarImage = fs.existsSync(avatarImagePath);
  //           const championAvatarDir = path.join(
  //             __dirname,
  //             '..',
  //             'assets',
  //             'set' + version.set.ordinal,
  //             'champion',
  //             'avatar',
  //           );
  //           if (!existedChampionAvatarImage) {
  //             if (!fs.existsSync(championAvatarDir))
  //               fs.mkdirSync(championAvatarDir, { recursive: true });
  //             const path = `${versionFetch.split('.').slice(0, 2).join('.')}/game/assets/characters/${champ.id.toLowerCase()}/hud/${champ.id.toLowerCase()}_square.tft_set${version.set.ordinal}.png`;
  //             const imgBuffer = await this.communityDDragonService
  //               .getImage(path)
  //               .catch((e) => {
  //                 if (e.message === 'Community API is not available') {
  //                   return;
  //                 }
  //                 throw new WsException(e.message);
  //               });
  //             !!imgBuffer && fs.writeFileSync(avatarImagePath, imgBuffer);
  //           }
  //           // Square
  //           const squareImagePath = path.join(
  //             __dirname,
  //             '..',
  //             'assets',
  //             'set' + version.set.ordinal,
  //             'champion',
  //             'square',
  //             champ.id + '.png',
  //           );
  //           const existedChampionSquareImage = fs.existsSync(squareImagePath);
  //           const championSquareDir = path.join(
  //             __dirname,
  //             '..',
  //             'assets',
  //             'set' + version.set.ordinal,
  //             'champion',
  //             'square',
  //           );
  //           if (!existedChampionSquareImage) {
  //             if (!fs.existsSync(championSquareDir))
  //               fs.mkdirSync(championSquareDir, { recursive: true });
  //             const path = `${versionFetch.split('.').slice(0, 2).join('.')}/game/assets/characters/${champ.id.toLowerCase()}/hud/${champ.id.toLowerCase()}_square.tft_set${version.set.ordinal}.png`;
  //             const imgBuffer = await this.communityDDragonService
  //               .getImage(path)
  //               .catch((e) => {
  //                 if (e.message === 'Community API is not available') {
  //                   return;
  //                 }
  //                 throw new WsException(e.message);
  //               });
  //             !!imgBuffer && fs.writeFileSync(squareImagePath, imgBuffer);
  //           }

  //           championDTO.push({
  //             riotId: champ.id,
  //             name: champ.name,
  //             images: {
  //               avatar: `/assets/set${version.set.ordinal}/champion/avatar/${champ.id}.png`,
  //               square: `/assets/set${version.set.ordinal}/champion/square/${champ.id}.png`,
  //               splash: `/assets/set${version.set.ordinal}/champion/splash/${champ.id}.png`,
  //             },
  //             language: lang,
  //             version,
  //             ability: {
  //               name: thisCommunityChampData?.ability?.name ?? '',
  //               image: `/assets/set${version.set.ordinal}/champion/skill/${champ.id}.png`,
  //               desc: thisCommunityChampData?.ability?.desc ?? '',
  //               variables: thisCommunityChampData?.ability?.variables ?? [],
  //             },
  //             cost: champ.tier,
  //             stats: thisCommunityChampData?.stats ?? {},
  //             traits: championTrait,
  //           });
  //         })(),
  //       );
  //     });
  //     langPromises.push(Promise.all(champPromises));
  //   });
  //   await Promise.all(langPromises);
  //   await Promise.all(
  //     championDTO.map(async (champ) => {
  //       this.io.emit('champions', {
  //         id: champ.riotId,
  //         lang: champ.language,
  //         name: champ.name,
  //       });
  //       await this.championService.createChampions(champ).catch((e) => {
  //         if (e.message === 'Champion existed') {
  //           return;
  //         }
  //         throw new WsException(e.message);
  //       });
  //     }),
  //   );

  //   // check Augment
  //   const augmentsDTO = [];
  //   Object.values(EnumLanguage).forEach((lang) => {
  //     const augmentsLang = augments[lang];
  //     augmentsLang.forEach((aug) => {
  //       const thisCommunityAugmentData = communityDDragon[lang].items.find(
  //         (el) => el.apiName === aug.id,
  //       );
  // let imgPath = thisCommunityAugmentData?.icon
  //   .split('/')
  //   .at(-1)
  //   .split('.')
  //   .slice(0, -1)
  //   .join('.')
  //   .toLowerCase() as string;
  // if (
  //   imgPath.startsWith('crest_') &&
  //   imgPath.split('_')[1].endsWith('1')
  // ) {
  //   const imagePaths = imgPath.split('_');
  //   imagePaths[1] = imagePaths[1].slice(0, -1);
  //   imgPath = imagePaths.join('_');
  // }

  //       let pathh = `${versionFetch.split('.').slice(0, 2).join('.')}/game/assets/maps/tft/icons/augments/choiceui/${imgPath}.png`;

  //       augmentsDTO.push({
  //         riotId: aug.id,
  //         language: lang,
  //         version,
  //         name: aug.name,
  //         image: `/assets/set${version.set.ordinal}/augment/${aug.id}.png`,
  //         desc: thisCommunityAugmentData?.desc ?? '',
  //         associatedTraits: thisCommunityAugmentData?.associatedTraits ?? [],
  //         incompatibleTraits:
  //           thisCommunityAugmentData?.incompatibleTraits ?? [],
  //         effects: thisCommunityAugmentData?.effects ?? {},
  //         tier: EnumAugmentTier.SILVER,
  //         imagePath: pathh,
  //       });
  //     });
  //   });
  //   await Promise.all(
  //     augmentsDTO.map(async (aug) => {
  //       await this.augmentsService.createAugments(aug).catch((e) => {
  //         if (e.message === 'Augment existed') {
  //           return;
  //         }
  //         throw new WsException(e.message);
  //       });
  //     }),
  //   );
  //   for (const aug of augmentsDTO) {
  //     const imagePath = path.join(
  //       __dirname,
  //       '..',
  //       'assets',
  //       'set' + version.set.ordinal,
  //       'augment',
  //       aug.riotId + '.png',
  //     );
  //     const imageDir = path.join(
  //       __dirname,
  //       '..',
  //       'assets',
  //       'set' + version.set.ordinal,
  //       'augment',
  //     );
  //     const existed = fs.existsSync(imagePath);
  //     const dirExists = fs.existsSync(imageDir);
  //     if (!dirExists) {
  //       fs.mkdirSync(imageDir, { recursive: true });
  //     }
  //     if (!existed) {
  //       const imageBuffer = await this.communityDDragonService
  //         .getImage(aug.imagePath)
  //         .catch((e) => {
  //           if (e.message === 'Community API is not available') {
  //             return;
  //           }
  //           throw new WsException(e.message);
  //         });
  //       !!imageBuffer && fs.writeFileSync(imagePath, imageBuffer);
  //       this.logger.info(`Augment image saved: ${aug.riotId}`);
  //       this.io.emit('augmentImageSaved', `Augment image saved: ${aug.riotId}`);
  //     }
  //   }

  //   // check Item
  //   const itemsDTO = [];
  //   Object.values(EnumLanguage).forEach((lang) => {
  //     const itemsLang = items[lang];
  //     itemsLang.forEach((item) => {
  //       const thisCommunityItemData = communityDDragon[lang].items.find(
  //         (el) => el.apiName === item.id,
  //       );
  //       const pathh = item.image.full;

  //       itemsDTO.push({
  //         riotId: item.id,
  //         language: lang,
  //         version,
  //         name: item.name,
  //         image: `/assets/set${version.set.ordinal}/item/${item.id}.png`,
  //         desc: thisCommunityItemData?.desc ?? '',
  //         unique: thisCommunityItemData?.unique ?? false,
  //         composition: thisCommunityItemData?.composition ?? [],
  //         stats: thisCommunityItemData?.stats ?? {},
  //         effects: thisCommunityItemData?.effects ?? {},
  //         imagePath: pathh,
  //       });
  //     });
  //   });
  //   const imageDir = path.join(
  //     __dirname,
  //     '..',
  //     'assets',
  //     'set' + version.set.ordinal,
  //     'item',
  //   );
  //   const dirExists = fs.existsSync(imageDir);
  //   if (!dirExists) {
  //     fs.mkdirSync(imageDir, { recursive: true });
  //   }
  //   const itemImageQueueSave: { imagePath: string; riotPath: string }[] = [];
  //   await Promise.all(
  //     itemsDTO.map(async (item) => {
  //       const imagePath = path.join(
  //         __dirname,
  //         '..',
  //         'assets',
  //         'set' + version.set.ordinal,
  //         'item',
  //         item.riotId + '.png',
  //       );
  //       const existed = fs.existsSync(imagePath);
  //       if (!existed) {
  //         !itemImageQueueSave.find((el) => el.imagePath === imagePath) &&
  //           itemImageQueueSave.push({ imagePath, riotPath: item.imagePath });
  //       }
  //       await this.itemsService.createItems(item).catch((e) => {
  //         if (e.message === 'Item existed') {
  //           return;
  //         }
  //         throw new WsException(e.message);
  //       });
  //     }),
  //   );
  //   await Promise.all(
  //     itemImageQueueSave.map(async ({ imagePath, riotPath }) => {
  //       try {
  //         const imageBuffer = await this.riotDDragonService.igetItemImage({
  //           version: versionFetch,
  //           imagePath: riotPath,
  //         });
  //         !!imageBuffer && fs.writeFileSync(imagePath, imageBuffer);
  //       } catch (e) {
  //         if (e.message === 'Riot DDragon API is not available') {
  //           return;
  //         }
  //         throw new WsException(e.message);
  //       }
  //     }),
  //   );

  //   // Region Portal
  //   const regionPortalDTO = [];
  //   Object.values(EnumLanguage).forEach((lang) => {
  //     const regionPortalLang = regionPortal[lang];
  //     regionPortalLang.forEach((regionPortal) => {
  //       regionPortalDTO.push({
  //         riotId: regionPortal.id,
  //         name: regionPortal.name,
  //         image: `/assets/set${version.set.ordinal}/region-portal/${regionPortal.id}.png`,
  //         language: lang,
  //         version,
  //         desc: regionPortal.shortDescription,
  //       });
  //     });
  //   });

  //   await Promise.all(
  //     regionPortalDTO.map(async (regionPortal) => {
  //       await this.regionPortalService.create(regionPortal).catch((e) => {
  //         if (e.message === 'Region portal existed') {
  //           return;
  //         }
  //         throw new WsException(e.message);
  //       });
  //     }),
  //   );

  //   this.io.emit('test', regionPortalDTO);

  //   // Hero Augment

  //   // Charm

  //   // check Queues

  //   // check bổ sung Arena

  //   //  check bổ sung Regalia

  //   // check bổ sung Taticians
  //   interval && clearInterval(interval);
  //   client.disconnect();
  // }

  @SubscribeMessage('fetch')
  async handleFetch(
    @MessageBody('versionFetch') versionFetch: string,
    @MessageBody('mapVersion') mapVersion: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.info(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${versionFetch}`);
    let timer = 0;
    const interval = setInterval(() => {
      client.emit('timer', timer);
      timer++;
    }, 1);
    const version = await this.setsService.findVersion(versionFetch);
    if (!version) {
      this.logger.error('Version not found');
      throw new WsException('Version not found');
    }
    const commonityData = await Promise.all(
      Object.values(EnumLanguage).map(async (lang) =>
        this.communityDDragonService.getDDraggonData({
          version: versionFetch.split('.').slice(0, 2).join('.'),
          language: lang.toLowerCase(),
        }),
      ),
    );
    await this.fetchTrait(version, commonityData);

    await this.fetchChamp(version, commonityData);

    await this.fetchAugment(version, commonityData);

    interval && clearInterval(interval);
    client.disconnect();
  }

  private async fetchTrait(version: Version, communityData: any[]) {
    const data = await Promise.all(
      Object.values(EnumLanguage).map((lang) =>
        this.riotDDragonService.getTrait({
          version: version.name,
          language: lang,
        }),
      ),
    );
    const traitsMapped = data
      .map((el, index) => {
        const lang = Object.values(EnumLanguage)[index];
        return Object.values(el)
          .map((traitRiotData: any) =>
            Object.values(traitRiotData)
              .filter((el) => !!(typeof el === 'object'))
              .map((trait: any) => {
                const thisTraitCommunityData = communityData[index].setData
                  .find((el) => el.number === version.set.ordinal)
                  .traits.find((el) => el.apiName === trait.id);
                return {
                  riotId: trait.id,
                  name: trait.name,
                  image: `/assets/set${version.set.ordinal}/trait/${trait.id}.png`,
                  language: lang,
                  version,
                  desc: thisTraitCommunityData?.desc ?? '',
                  effects: thisTraitCommunityData?.effects ?? {},
                  riotImagPath: trait.image.full,
                };
              })
              .flat(),
          )
          .flat();
      })
      .flat();
    const traitImageNeedSave = [];
    const dirPath = path.join(
      __dirname,
      '..',
      'assets',
      'set' + version.set.ordinal,
      'trait',
    );
    const dirExists = fs.existsSync(dirPath);
    if (!dirExists) fs.mkdirSync(dirPath, { recursive: true });
    const traitsNeedSave = await Promise.all(
      traitsMapped.map(async (trait) => {
        const existedTrait = await this.traitService.findTrait({
          riotId: trait.riotId,
          lang: trait.language,
          version,
        });
        const imagePath = path.join(
          __dirname,
          '..',
          'assets',
          'set' + version.set.ordinal,
          'trait',
          trait.riotId + '.png',
        );
        const existed = fs.existsSync(imagePath);
        if (
          !existed &&
          !traitImageNeedSave.find((el) => el.riotId === trait.riotId)
        )
          traitImageNeedSave.push({
            imagePath: trait.riotImagPath,
            riotId: trait.riotId,
          });
        if (existedTrait) {
          return null;
        }
        return trait;
      }),
    ).then((el) => el.filter((el) => !!el));
    await this.traitService.createTraits(traitsNeedSave);
    await Promise.all(
      traitImageNeedSave.map(async (el) => {
        const imagePath = path.join(
          __dirname,
          '..',
          'assets',
          'set' + version.set.ordinal,
          'trait',
          el.riotId + '.png',
        );
        const imageBuffer = await this.riotDDragonService.getTraitImage({
          version: version.name,
          imagePath: el.imagePath,
        });
        !!imageBuffer && fs.writeFileSync(imagePath, imageBuffer);
      }),
    );
  }

  private async fetchChamp(version: Version, communityData: any[]) {
    const data = (
      await Promise.all(
        Object.values(EnumLanguage).map((lang) =>
          this.riotDDragonService.getChampion({
            version: version.name,
            language: lang,
          }),
        ),
      )
    ).map((el) => Object.values(el.data));

    const championsMapped = await Promise.all(
      data.map(async (el: any, index) => {
        const lang = Object.values(EnumLanguage)[index];
        return await Promise.all(
          el.map(async (champ) => {
            const thisCommunityChampData = communityData[index].setData
              .find((el) => el.number === version.set.ordinal)
              .champions.find((el) => el.apiName === champ.id);

            const champTraits = thisCommunityChampData?.traits
              ? await Promise.all(
                  thisCommunityChampData.traits.map(
                    async (name) =>
                      await this.traitService.findForChampFetch({
                        name,
                        version,
                        language: lang,
                      }),
                  ),
                )
              : [];
            return {
              riotId: champ.id,
              name: champ.name,
              images: {
                avatar: `/assets/set${version.set.ordinal}/champion/avatar/${champ.id}.png`,
                square: `/assets/set${version.set.ordinal}/champion/square/${champ.id}.png`,
                splash: `/assets/set${version.set.ordinal}/champion/splash/${champ.id}.png`,
              },
              language: lang,
              version,
              ability: {
                name: thisCommunityChampData?.ability?.name ?? '',
                image: `/assets/set${version.set.ordinal}/champion/skill/${champ.id}.png`,
                desc: thisCommunityChampData?.ability?.desc ?? '',
                variables: thisCommunityChampData?.ability?.variables ?? [],
              },
              cost: champ.tier,
              stats: thisCommunityChampData?.stats ?? {},
              traits: champTraits ?? [],
              skillImagePath: `${version.name.split('.').slice(0, 2).join('.')}/game/${thisCommunityChampData?.ability?.icon.slice(0, -4).toLowerCase()}.png`,
            };
          }),
        );
      }),
    ).then((el) => el.flat());
    const avatarDirPath = path.join(
      __dirname,
      '..',
      'assets',
      'set' + version.set.ordinal,
      'champion',
      'avatar',
    );
    if (!fs.existsSync(avatarDirPath))
      fs.mkdirSync(avatarDirPath, { recursive: true });
    const squareDirPath = path.join(
      __dirname,
      '..',
      'assets',
      'set' + version.set.ordinal,
      'champion',
      'square',
    );
    if (!fs.existsSync(squareDirPath))
      fs.mkdirSync(squareDirPath, { recursive: true });
    const splashDirPath = path.join(
      __dirname,
      '..',
      'assets',
      'set' + version.set.ordinal,
      'champion',
      'splash',
    );
    if (!fs.existsSync(splashDirPath))
      fs.mkdirSync(splashDirPath, { recursive: true });
    const skillDirPath = path.join(
      __dirname,
      '..',
      'assets',
      'set' + version.set.ordinal,
      'champion',
      'skill',
    );
    if (!fs.existsSync(skillDirPath))
      fs.mkdirSync(skillDirPath, { recursive: true });
    const avatarNeedSave = [];
    const squareNeedSave = [];
    const skillNeedSave = [];
    const champsNeedSave = await Promise.all(
      championsMapped.map(async (champ) => {
        // avatar
        const avatarPath = path.join(
          __dirname,
          '..',
          'assets',
          'set' + version.set.ordinal,
          'champion',
          'avatar',
          champ.riotId + '.png',
        );
        if (
          !fs.existsSync(avatarPath) &&
          !avatarNeedSave.find((el) => el.id === champ.riotId)
        ) {
          avatarNeedSave.push({
            fetchPath: `${version.name.split('.').slice(0, 2).join('.')}/game/assets/characters/${champ.riotId.toLowerCase()}/hud/${champ.riotId.toLowerCase()}_square.tft_set${version.set.ordinal}.png`,
            path: avatarPath,
            id: champ.riotId,
          });
        }
        // square
        const squarePath = path.join(
          __dirname,
          '..',
          'assets',
          'set' + version.set.ordinal,
          'champion',
          'square',
          champ.riotId + '.png',
        );
        if (
          !fs.existsSync(squarePath) &&
          !squareNeedSave.find((el) => el.id === champ.riotId)
        ) {
          squareNeedSave.push({
            fetchPath: `${version.name.split('.').slice(0, 2).join('.')}/game/assets/characters/${champ.riotId.toLowerCase()}/skins/base/images/${champ.riotId.toLowerCase()}_mobile.tft_set${version.set.ordinal}.png`,
            path: squarePath,
            id: champ.riotId,
          });
        }
        // skill
        const skillPath = path.join(
          __dirname,
          '..',
          'assets',
          'set' + version.set.ordinal,
          'champion',
          'skill',
          champ.riotId + '.png',
        );
        if (
          !fs.existsSync(skillPath) &&
          !skillNeedSave.find((el) => el.id === champ.riotId)
        ) {
          skillNeedSave.push({
            fetchPath: champ.skillImagePath,
            path: skillPath,
            id: champ.riotId,
          });
        }
        const existedChamp = await this.championService.findChampion({
          riotId: champ.riotId,
          lang: champ.language,
          version,
        });
        if (existedChamp) return null;
        return champ;
      }),
    ).then((el) => el.filter((el) => !!el));
    await this.championService.createChamps(champsNeedSave);
    await Promise.all(
      avatarNeedSave.map(async (el) => {
        const imgBuffer = await this.communityDDragonService
          .getImage(el.fetchPath)
          .catch((e) => {
            if (e.message === 'Community API is not available') {
              console.log('Fetch champion avatar image failed: ' + el.id);
              return;
            }
            throw new WsException(e.message);
          });
        !!imgBuffer && fs.writeFileSync(el.path, imgBuffer);
      }),
    );
    await Promise.all(
      squareNeedSave.map(async (el) => {
        const imgBuffer = await this.communityDDragonService
          .getImage(el.fetchPath)
          .catch((e) => {
            if (e.message === 'Community API is not available') {
              console.log('Fetch champ square image failed: ' + el.id);
              return;
            }
            throw new WsException(e.message);
          });
        !!imgBuffer && fs.writeFileSync(el.path, imgBuffer);
      }),
    );
    await Promise.all(
      skillNeedSave.map(async (el) => {
        const imgBuffer = await this.communityDDragonService
          .getImage(el.fetchPath)
          .catch((e) => {
            if (e.message === 'Community API is not available') {
              console.log('Fetch champ skill image failed: ' + el.id);
              return;
            }
            throw new WsException(e.message);
          });
        !!imgBuffer && fs.writeFileSync(el.path, imgBuffer);
      }),
    );
  }

  private async fetchAugment(version: Version, communityData: any[]) {
    const data = (
      await Promise.all(
        Object.values(EnumLanguage).map((lang) =>
          this.riotDDragonService.getAugment({
            version: version.name,
            language: lang,
          }),
        ),
      )
    ).map((el) => Object.values(el.data));

    const augmentsMapped = await Promise.all(
      data.map(async (el: any, index) => {
        const lang = Object.values(EnumLanguage)[index];
        return await Promise.all(
          el.map(async (augment) => {
            const thisCommunityAugmentData = communityData[index].items.find(
              (el) => el.apiName === augment.id,
            );
            let imgPath = thisCommunityAugmentData?.icon
              .split('/')
              .at(-1)
              .split('.')
              .slice(0, -1)
              .join('.')
              .toLowerCase() as string;
            if (
              imgPath.startsWith('crest_') &&
              imgPath.split('_')[1].endsWith('1')
            ) {
              const imagePaths = imgPath.split('_');
              imagePaths[1] = imagePaths[1].slice(0, -1);
              imgPath = imagePaths.join('_');
            }
            let pathh = `${version.name.split('.').slice(0, 2).join('.')}/game/assets/maps/tft/icons/augments/choiceui/${imgPath}.png`;

            return {
              riotId: augment.id,
              language: lang,
              version,
              name: augment.name,
              image: `/assets/set${version.set.ordinal}/augment/${augment.id}.png`,
              desc: thisCommunityAugmentData?.desc ?? '',
              associatedTraits:
                thisCommunityAugmentData?.associatedTraits ?? [],
              incompatibleTraits:
                thisCommunityAugmentData?.incompatibleTraits ?? [],
              effects: thisCommunityAugmentData?.effects ?? {},
              tier: EnumAugmentTier.SILVER,
              imagePath: pathh,
            };
          }),
        );
      }),
    ).then((el) => el.flat());
    const dirPath = path.join(
      __dirname,
      '..',
      'assets',
      'set' + version.set.ordinal,
      'augment',
    );
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    const augmentsImageNeedSave = [];
    const augmentsNeedSave = await Promise.all(
      augmentsMapped.map(async (aug: any) => {
        const imagePath = path.join(
          __dirname,
          '..',
          'assets',
          'set' + version.set.ordinal,
          'augment',
          aug.riotId + '.png',
        );
        const existed = fs.existsSync(imagePath);
        if (
          !existed &&
          !augmentsImageNeedSave.find((el) => el.id === aug.riotId)
        ) {
          augmentsImageNeedSave.push({
            id: aug.riotId,
            pathFetch: aug.imagePath,
            path: imagePath,
          });
        }
        const existedAugment = await this.augmentsService.findAugment({
          riotId: aug.riotId,
          lang: aug.language,
          version,
        });
        if (existedAugment) return null;
        return aug;
      }),
    ).then((el) => el.filter((el) => !!el));
    this.io.emit('test', augmentsNeedSave);
    this.io.emit('test', augmentsImageNeedSave);
    await this.augmentsService.createAugments(augmentsNeedSave);
    await Promise.all(
      augmentsImageNeedSave.map(async (el) => {
        const imageBuffer = await this.communityDDragonService
          .getImage(el.pathFetch)
          .catch((e) => {
            if (e.message === 'Riot DDragon API is not available') {
              console.log('Fetch augment image failed: ' + el.id);
              return;
            }
            throw new WsException(e.message);
          });
        !!imageBuffer && fs.writeFileSync(el.path, imageBuffer);
      }),
    );
  }

  private async fetchItem() {}

  private async fetchRegionPortal() {}
}
