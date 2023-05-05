import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Asset, AssetType, Currency } from '@prisma/client';

@Injectable()
export class TwelveDataService {
  constructor(private readonly httpService: HttpService) {}

  async fetchPrice(asset: Asset, currency: Currency) {
    const symbol =
      asset.type === AssetType.Stock
        ? asset.tickerSymbol
        : `${asset.tickerSymbol}/${currency.code}`;

    const response = await this.httpService.axiosRef.get<{ price: number }>(
      '/price',
      {
        params: { symbol },
      },
    );

    return response.data.price;
  }
}
