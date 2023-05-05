import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Asset, Currency } from '@prisma/client';
import Redis from 'ioredis';

import { PrismaService } from 'src/prisma/prisma.service';
import { TwelveDataService } from './twelve-data.service';

@Injectable()
export class AssetPricesCacheService implements OnApplicationBootstrap {
  constructor(
    private readonly prisma: PrismaService,
    private readonly twelveDataService: TwelveDataService,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
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

  async getCachedAssetPrice(assetTickerSymbol: string, currencyCode: string) {
    return Number(
      await this.redis.get(
        this.buildAssetPriceCachedKey(assetTickerSymbol, currencyCode),
      ),
    );
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
        const cachedAssetPrice = await this.getCachedAssetPrice(
          tradingPair.asset.tickerSymbol,
          tradingPair.currency.code,
        );

        if (cachedAssetPrice === null) {
          await this.fetchAssetPrice(tradingPair.asset, tradingPair.currency);
        }
      }),
    );
  }

  private async fetchAssetPrice(asset: Asset, currency: Currency) {
    const price = await this.twelveDataService.fetchPrice(asset, currency);

    await this.redis.set(
      this.buildAssetPriceCachedKey(asset.tickerSymbol, currency.code),
      price,
      'EX',
      60 * 60,
    );
  }

  private buildAssetPriceCachedKey(
    assetTickerSymbol: string,
    currencyCode: string,
  ) {
    return `asset-price-cached:${assetTickerSymbol}/${currencyCode}`;
  }
}
