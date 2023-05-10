import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Redis from 'ioredis';

import { PrismaService } from '../prisma/prisma.service';
import {
  buildTradingPairSymbol,
  TradingPairWithAssociations,
} from './trading-pairs.utils';
import { TwelveDataService } from './twelve-data.service';

@Injectable()
export class TradingPairsPriceCacheService implements OnApplicationBootstrap {
  constructor(
    private readonly prisma: PrismaService,
    private readonly twelveDataService: TwelveDataService,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async fetchAndCacheTradingPairsPrice() {
    const tradingPairs = await this.prisma.tradingPair.findMany({
      include: {
        asset: true,
        currency: true,
      },
    });

    await Promise.all(
      tradingPairs.map(
        async (tradingPair) =>
          await this.fetchAndCacheTradingPairPrice(tradingPair),
      ),
    );
  }

  async getCachedTradingPairPrice(tradingPair: TradingPairWithAssociations) {
    return Number(
      await this.redis.get(this.buildTradingPairPriceCacheKey(tradingPair)),
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
        const cachedTradingPairPrice = await this.getCachedTradingPairPrice(
          tradingPair,
        );

        if (cachedTradingPairPrice === null) {
          await this.fetchAndCacheTradingPairPrice(tradingPair);
        }
      }),
    );
  }

  private async fetchAndCacheTradingPairPrice(
    tradingPair: TradingPairWithAssociations,
  ) {
    const price = await this.twelveDataService.fetchPrice(tradingPair);

    await this.redis.set(
      this.buildTradingPairPriceCacheKey(tradingPair),
      price,
      'EX',
      60 * 60,
    );
  }

  private buildTradingPairPriceCacheKey(
    tradingPair: TradingPairWithAssociations,
  ) {
    return `trading-pair-price-cached:${buildTradingPairSymbol(tradingPair)}`;
  }
}
