import { HttpService } from '@nestjs/axios';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { LoggerService } from '@modules/core/logger/logger.service';
import { EnumLanguage } from '@ts/enums/language';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class CommunityDDragonService {
  constructor(
    private readonly httpAxiosService: HttpService,
    private readonly loggerService: LoggerService,
  ) {}

  async getDDraggonData({
    version,
    language,
  }: {
    version: string;
    language: string;
  }) {
    const response = await firstValueFrom(
      this.httpAxiosService.get(`${version}/cdragon/tft/${language}.json`).pipe(
        catchError((err: AxiosError) => {
          this.loggerService.error(
            'Community API is not available' +
              err.name +
              err.code +
              err.message +
              err.stack,
          );
          throw new ServiceUnavailableException(
            'Community API is not available',
          );
        }),
      ),
    );
    return response.data;
  }

  async getImage(path: string) {
    const response = await firstValueFrom(
      this.httpAxiosService.get(path, { responseType: 'arraybuffer' }).pipe(
        catchError((err: AxiosError) => {
          throw new ServiceUnavailableException(
            'Community API is not available',
          );
        }),
      ),
    );

    return response.data;
  }
}
