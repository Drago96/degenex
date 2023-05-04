import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Asset, AssetType, Currency } from '@prisma/client';
import Redis from 'ioredis';

import { PrismaService } from 'src/prisma/prisma.service';
import { TwelveDataService } from './twelve-data.service';

@Injectable()
export class AssetsService implements OnApplicationBootstrap {
  constructor(
    private readonly prisma: PrismaService,
    private readonly twelveDataService: TwelveDataService,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  @Cron('0 * * * *')
  async fetchAssetPrices() {
    const tradingPairs = await this.prisma.tradingPair.findMany({
      include: {
        asset: true,
        currency: true,
      },
    });

    await Promise.all(
      tradingPairs.map(
        async (tradingPair) =>
          await this.fetchAssetPrice(tradingPair.asset, tradingPair.currency),
      ),
    );
  }

  private async fetchAssetPrice(asset: Asset, currency: Currency) {
    const symbol =
      asset.type === AssetType.Stock
        ? asset.tickerSymbol
        : `${asset.tickerSymbol}/${currency.code}`;

    const price = await this.twelveDataService.fetchPrice(symbol);

    await this.publishAssetPrice(asset.tickerSymbol, currency.code, price);
  }

  private async publishAssetPrice(
    assetTickerSymbol: string,
    currencyCode: string,
    price: number,
  ) {
    await this.redis.xadd(
      this.buildAssetPriceKey(assetTickerSymbol, currencyCode),
      '*',
      'price',
      price,
    );
  }

  private async getLatestAssetPrice(
    assetTickerSymbol: string,
    currencyCode: string,
  ) {
    const latestAssetPriceEntry = await this.redis.xrevrange(
      this.buildAssetPriceKey(assetTickerSymbol, currencyCode),
      '+',
      '-',
      'COUNT',
      1,
    );

    if (latestAssetPriceEntry.length === 0) {
      return null;
    }

    return Number(latestAssetPriceEntry.at(0).at(1).at(1));
  }

  private buildAssetPriceKey(assetTickerSymbol: string, currencyCode: string) {
    return `asset-price:${assetTickerSymbol}/${currencyCode}`;
  }

  async onApplicationBootstrap() {
    const tradingPairs = await this.prisma.tradingPair.findMany({
      include: {
        asset: true,
        currency: true,
      },
    });

    await Promise.all(
      tradingPairs.map(async (tradingPair) => {
        const latestAssetPrice = await this.getLatestAssetPrice(
          tradingPair.asset.tickerSymbol,
          tradingPair.currency.code,
        );

        if (latestAssetPrice === null) {
          await this.fetchAssetPrice(tradingPair.asset, tradingPair.currency);
        }
      }),
    );
  }
}
