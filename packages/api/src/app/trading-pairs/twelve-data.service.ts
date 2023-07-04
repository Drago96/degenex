import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AssetType } from '@prisma/client';

import { buildTradingPairSymbol } from '@degenex/common';
import { TradingPairWithAssociations } from './trading-pair-with-associations';

@Injectable()
export class TwelveDataService {
  constructor(private readonly httpService: HttpService) {}

  async fetchPrice(tradingPair: TradingPairWithAssociations) {
    const symbol =
      tradingPair.baseAsset.type === AssetType.Stock
        ? tradingPair.baseAsset.tickerSymbol
        : buildTradingPairSymbol(tradingPair);

    const response = await this.httpService.axiosRef.get<{ price: number }>(
      '/price',
      {
        params: { symbol },
      }
    );

    return response.data.price;
  }
}
