import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AssetPrice } from './asset-price.dto';

@Injectable()
export class TwelveDataService {
  constructor(private readonly httpService: HttpService) {}

  async fetchPrice(symbol: string) {
    const response = await this.httpService.axiosRef.get<AssetPrice>('/price', {
      params: { symbol },
    });

    return response.data.price;
  }
}
