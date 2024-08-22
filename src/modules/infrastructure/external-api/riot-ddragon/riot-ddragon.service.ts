import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { LoggerService } from '@modules/core/logger/logger.service';
import { EnumLanguage } from '@ts/enums/language';
import { TypeRiotPlatform } from '@data/riot-platform';

@Injectable()
export class RiotDDragonService {
  constructor(
    private readonly httpAxiosService: HttpService,
    private readonly loggerService: LoggerService,
  ) {}

  async getVersionsList() {
    const response = await firstValueFrom(
      this.httpAxiosService.get(`api/versions.json`).pipe(
        catchError((err: AxiosError) => {
          this.loggerService.error(
            'Riot DDragon API is not available' +
              err.name +
              err.code +
              err.message +
              err.stack,
          );
          throw new ServiceUnavailableException(
            'Riot DDragon API is not available',
          );
        }),
      ),
    );
    return response.data as string[];
  }

  async getPlatformCurrVersion(platform: TypeRiotPlatform) {
    const response = await firstValueFrom(
      this.httpAxiosService.get(`realms/${platform}.json`).pipe(
        catchError((err: AxiosError) => {
          this.loggerService.error(
            'Riot DDragon API is not available' +
              err.name +
              err.code +
              err.message +
              err.stack,
          );
          throw new ServiceUnavailableException(
            'Riot DDragon API is not available',
          );
        }),
      ),
    );
    return response.data.v as string;
  }

  async getArena({
    version,
    language,
  }: {
    version: string;
    language: EnumLanguage;
  }) {
    await this.checkExistVersion(version);
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/data/${language}/tft-arena.json`)
        .pipe(
          catchError((err: AxiosError) => {
            this.loggerService.error(
              'Riot DDragon API is not available' +
                err.name +
                err.code +
                err.message +
                err.stack,
            );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );
    return response.data;
  }

  async getAugment({
    version,
    language,
  }: {
    version: string;
    language: EnumLanguage;
  }) {
    await this.checkExistVersion(version);
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/data/${language}/tft-augments.json`)
        .pipe(
          catchError((err: AxiosError) => {
            this.loggerService.error(
              'Riot DDragon API is not available' +
                err.name +
                err.code +
                err.message +
                err.stack,
            );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );
    return response.data;
  }

  async getChampion({
    version,
    language,
  }: {
    version: string;
    language: EnumLanguage;
  }) {
    await this.checkExistVersion(version);
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/data/${language}/tft-champion.json`)
        .pipe(
          catchError((err: AxiosError) => {
            this.loggerService.error(
              'Riot DDragon API is not available' +
                err.name +
                err.code +
                err.message +
                err.stack,
            );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );
    return response.data;
  }

  async getItem({
    version,
    language,
  }: {
    version: string;
    language: EnumLanguage;
  }) {
    await this.checkExistVersion(version);
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/data/${language}/tft-item.json`)
        .pipe(
          catchError((err: AxiosError) => {
            this.loggerService.error(
              'Riot DDragon API is not available' +
                err.name +
                err.code +
                err.message +
                err.stack,
            );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );
    return response.data;
  }

  async getQueues({
    version,
    language,
  }: {
    version: string;
    language: EnumLanguage;
  }) {
    await this.checkExistVersion(version);
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/data/${language}/tft-queues.json`)
        .pipe(
          catchError((err: AxiosError) => {
            this.loggerService.error(
              'Riot DDragon API is not available' +
                err.name +
                err.code +
                err.message +
                err.stack,
            );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );
    return response.data;
  }

  async getRegalia({
    version,
    language,
  }: {
    version: string;
    language: EnumLanguage;
  }) {
    await this.checkExistVersion(version);
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/data/${language}/tft-regalia.json`)
        .pipe(
          catchError((err: AxiosError) => {
            this.loggerService.error(
              'Riot DDragon API is not available' +
                err.name +
                err.code +
                err.message +
                err.stack,
            );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );
    return response.data;
  }

  async getRegionPortal({
    version,
    language,
  }: {
    version: string;
    language: EnumLanguage;
  }) {
    await this.checkExistVersion(version);
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/data/${language}/tft-region-portals.json`)
        .pipe(
          catchError((err: AxiosError) => {
            this.loggerService.error(
              'Riot DDragon API is not available' +
                err.name +
                err.code +
                err.message +
                err.stack,
            );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );
    return response.data;
  }

  async getTactician({
    version,
    language,
  }: {
    version: string;
    language: EnumLanguage;
  }) {
    await this.checkExistVersion(version);
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/data/${language}/tft-tactician.json`)
        .pipe(
          catchError((err: AxiosError) => {
            this.loggerService.error(
              'Riot DDragon API is not available' +
                err.name +
                err.code +
                err.message +
                err.stack,
            );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );
    return response.data;
  }

  async getTrait({
    version,
    language,
  }: {
    version: string;
    language: EnumLanguage;
  }) {
    await this.checkExistVersion(version);
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/data/${language}/tft-trait.json`)
        .pipe(
          catchError((err: AxiosError) => {
            this.loggerService.error(
              'Riot DDragon API is not available' +
                err.name +
                err.code +
                err.message +
                err.stack,
            );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );
    return response.data;
  }

  async getTraitImage({
    version,
    imagePath,
  }: {
    version: string;
    imagePath: string;
  }) {
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/img/tft-trait/${imagePath}`, {
          responseType: 'arraybuffer',
        })
        .pipe(
          catchError((err: AxiosError) => {
            // this.loggerService.error(
            //   'Riot DDragon API is not available' +
            //     err.name +
            //     err.code +
            //     err.message +
            //     err.stack,
            // );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );

    return response.data;
  }

  // Special Set 12
  async getCharm({
    version,
    language,
  }: {
    version: string;
    language: EnumLanguage;
  }) {
    await this.checkExistVersion(version);
    const response = await firstValueFrom(
      this.httpAxiosService
        .get(`cdn/${version}/data/${language}/tft-charms.json`)
        .pipe(
          catchError((err: AxiosError) => {
            this.loggerService.error(
              'Riot DDragon API is not available' +
                err.name +
                err.code +
                err.message +
                err.stack,
            );
            throw new ServiceUnavailableException(
              'Riot DDragon API is not available',
            );
          }),
        ),
    );
    return response.data;
  }

  private async checkExistVersion(version: string) {
    const versionsList = await this.getVersionsList();
    if (!versionsList.includes(version)) {
      throw new NotFoundException('This Riot DDragon version not found');
    }
  }
}
