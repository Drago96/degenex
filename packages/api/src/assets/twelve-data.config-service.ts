import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from 'src/configuration';

const BASE_URL = 'https://twelve-data1.p.rapidapi.com';

@Injectable()
export class TwelveDataConfigService implements HttpModuleOptionsFactory {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: BASE_URL,
      headers: {
        'X-RapidAPI-Key': this.configService.get('RAPID_API_KEY'),
        'X-RapidAPI-Host': new URL(BASE_URL).hostname,
      },
    };
  }
}
