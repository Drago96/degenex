import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import Redis from 'ioredis';
import { pick } from 'lodash';
import { map, Observable, scan, Subject } from 'rxjs';

import { PrismaService } from '../prisma/prisma.service';
import { TradingPairPriceUpdateDto } from './trading-pair-price-update.dto';
import { TradingPairsPriceCacheService } from './trading-pairs-price-cache.service';
import {
  buildTradingPairSymbol,
  TradingPairWithAssociations,
} from './trading-pairs.utils';

@Injectable()
export class TradingPairsPriceStreamService implements OnModuleDestroy {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tradingPairsPriceCacheService: TradingPairsPriceCacheService,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  private tradingPairPriceUpdate$ = new Subject<TradingPairPriceUpdateDto>();
  private latestTradingPairsPrice$: Observable<{
    [tradingPairSymbol: string]: number;
  }> = this.tradingPairPriceUpdate$.pipe(
    scan(
      (accumulatedTradingPairsPrice, tradingPairPriceUpdate) => ({
        ...accumulatedTradingPairsPrice,
        [tradingPairPriceUpdate.symbol]: tradingPairPriceUpdate.price,
      }),
      {},
    ),
  );

  @Interval(1000)
  async setLatestTradingPairsPrice() {
    const tradingPairs = await this.prisma.tradingPair.findMany({
      include: {
        asset: true,
        currency: true,
      },
    });

    await Promise.all(
      tradingPairs.map(async (tradingPair) => {
        const cachedTradingPairPrice =
          await this.tradingPairsPriceCacheService.getCachedTradingPairPrice(
            tradingPair,
          );

        await this.setLatestTradingPairPrice(
          tradingPair,
          this.generateApproximateTradingPairPrice(cachedTradingPairPrice),
        );
      }),
    );
  }

  @Interval(1000)
  async getLatestTradingPairsPrice() {
    const tradingPairs = await this.prisma.tradingPair.findMany({
      include: {
        asset: true,
        currency: true,
      },
    });

    await Promise.all(
      tradingPairs.map(async (tradingPair) => {
        const latestTradingPairPrice = await this.getLatestTradingPairPrice(
          tradingPair,
        );

        this.tradingPairPriceUpdate$.next({
          id: tradingPair.id,
          symbol: buildTradingPairSymbol(tradingPair),
          price: latestTradingPairPrice,
        });
      }),
    );
  }

  getPricesForTradingPairSymbols$(tradingPairSymbols: string[]) {
    return this.latestTradingPairsPrice$.pipe(
      map((latestTradingPairPrices) =>
        pick(latestTradingPairPrices, tradingPairSymbols),
      ),
    );
  }

  onModuleDestroy() {
    this.tradingPairPriceUpdate$.complete();
  }

  private async setLatestTradingPairPrice(
    tradingPair: TradingPairWithAssociations,
    price: number,
  ) {
    await this.redis.xadd(
      this.buildTradingPairPriceStreamKey(tradingPair),
      '*',
      'price',
      price,
    );
  }

  private async getLatestTradingPairPrice(
    tradingPair: TradingPairWithAssociations,
  ) {
    const latestTradingPairPriceEntry = await this.redis.xrevrange(
      this.buildTradingPairPriceStreamKey(tradingPair),
      '+',
      '-',
      'COUNT',
      1,
    );

    if (latestTradingPairPriceEntry.length === 0) {
      return null;
    }

    return Number(latestTradingPairPriceEntry.at(0).at(1).at(1));
  }

  private generateApproximateTradingPairPrice(cachedTradingPairPrice: number) {
    const maxPrice =
      cachedTradingPairPrice + (1 / 100) * cachedTradingPairPrice;
    const minPrice =
      cachedTradingPairPrice - (1 / 100) * cachedTradingPairPrice;

    return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
  }

  private buildTradingPairPriceStreamKey(
    tradingPair: TradingPairWithAssociations,
  ) {
    return `trading-pair-price-stream:${buildTradingPairSymbol(tradingPair)}`;
  }
}
