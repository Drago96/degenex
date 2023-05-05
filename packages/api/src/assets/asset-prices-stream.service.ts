import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import Redis from 'ioredis';
import { pick } from 'lodash';
import { map, Observable, scan, Subject } from 'rxjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { AssetPriceDto } from './asset-price.dto';
import { AssetPricesCacheService } from './asset-prices-cache.service';

@Injectable()
export class AssetPricesStreamService implements OnModuleDestroy {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assetPricesCacheService: AssetPricesCacheService,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  private assetPriceUpdate$ = new Subject<AssetPriceDto>();
  private latestAssetPrices$: Observable<{
    [tradingPairSymbol: string]: number;
  }> = this.assetPriceUpdate$.pipe(
    scan(
      (accumulatedAssetPrices, assetPriceUpdate) => ({
        ...accumulatedAssetPrices,
        [`${assetPriceUpdate.assetTickerSymbol}/${assetPriceUpdate.currencyCode}`]:
          assetPriceUpdate.price,
      }),
      {},
    ),
  );

  @Interval(1000)
  async setLatestAssetPrices() {
    const tradingPairs = await this.prisma.tradingPair.findMany({
      include: {
        asset: true,
        currency: true,
      },
    });

    await Promise.all(
      tradingPairs.map(async (tradingPair) => {
        const cachedAssetPrice =
          await this.assetPricesCacheService.getCachedAssetPrice(
            tradingPair.asset.tickerSymbol,
            tradingPair.currency.code,
          );

        await this.setLatestAssetPrice(
          tradingPair.asset.tickerSymbol,
          tradingPair.currency.code,
          this.generateApproximateAssetPrice(cachedAssetPrice),
        );
      }),
    );
  }

  @Interval(1000)
  async getLatestAssetPrices() {
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

        this.assetPriceUpdate$.next({
          assetTickerSymbol: tradingPair.asset.tickerSymbol,
          currencyCode: tradingPair.currency.code,
          price: latestAssetPrice,
        });
      }),
    );
  }

  getPricesForTradingSymbols$(tradingSymbols: string[]) {
    return this.latestAssetPrices$.pipe(
      map((latestAssetPrices) => pick(latestAssetPrices, tradingSymbols)),
    );
  }

  onModuleDestroy() {
    this.assetPriceUpdate$.complete();
  }

  private async setLatestAssetPrice(
    assetTickerSymbol: string,
    currencyCode: string,
    price: number,
  ) {
    await this.redis.xadd(
      this.buildAssetPriceStreamKey(assetTickerSymbol, currencyCode),
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
      this.buildAssetPriceStreamKey(assetTickerSymbol, currencyCode),
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

  private generateApproximateAssetPrice(cachedAssetPrice: number) {
    const maxPrice = cachedAssetPrice + (1 / 100) * cachedAssetPrice;
    const minPrice = cachedAssetPrice - (1 / 100) * cachedAssetPrice;

    return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
  }

  private buildAssetPriceStreamKey(
    assetTickerSymbol: string,
    currencyCode: string,
  ) {
    return `asset-price-stream:${assetTickerSymbol}/${currencyCode}`;
  }
}
