import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AssetType } from '@prisma/client';
import {
  buildTradingPairSymbol,
  TradingPairWithAssociations,
} from './trading-pairs.utils';

@Injectable()
export class TwelveDataService {
  constructor(private readonly httpService: HttpService) {}

  async fetchPrice(tradingPair: TradingPairWithAssociations) {
    const symbol =
      tradingPair.asset.type === AssetType.Stock
        ? tradingPair.asset.tickerSymbol
        : buildTradingPairSymbol(tradingPair);

    const response = await this.httpService.axiosRef.get<{ price: number }>(
      '/price',
      {
        params: { symbol },
      },
    );

    return response.data.price;
  }
}
