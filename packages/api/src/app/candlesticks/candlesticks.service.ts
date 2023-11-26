import { Injectable } from '@nestjs/common';
import Redlock from 'redlock';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { Decimal } from '@prisma/client/runtime/library';
import { maxBy, zip } from 'lodash';
import moment from 'moment';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CandlestickAggregateDto } from './dto/candlestick-aggregate.dto';
import { Candlestick, CandlestickInterval, Trade } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CurrentCandlestickDto,
  CurrentCandlestickSchema,
  CursorBasedQueryOptionsDto,
  UnreachableCodeException,
} from '@degenex/common';

const PAGE_SIZE = 50;
const CURSOR_DIRECTION = 'backwards';

@Injectable()
export class CandlesticksService {
  private redlock: Redlock;

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly prisma: PrismaService,
  ) {
    this.redlock = new Redlock([redis]);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async persistCandlesticks() {
    const tradingPairs = await this.prisma.tradingPair.findMany({
      select: { id: true },
    });

    const currentCandlesticks = await Promise.all(
      tradingPairs.map((tradingPair) => {
        return this.openNewCandlestick(tradingPair.id, 'OneHour');
      }),
    );

    await this.prisma.candlestick.createMany({
      data: zip(
        currentCandlesticks,
        tradingPairs.map((tradingPair) => tradingPair.id),
      ).map(([currentCandlestick, tradingPairId]) => {
        if (!currentCandlestick || !tradingPairId) {
          throw new UnreachableCodeException();
        }

        return {
          tradingPairId,
          baseAssetVolume: currentCandlestick.baseAssetVolume,
          closePrice: currentCandlestick.lastTradePrice,
          highestPrice: currentCandlestick.highestPrice,
          interval: 'OneHour',
          lastTradeId: currentCandlestick.lastTradeId,
          lowestPrice: currentCandlestick.lowestPrice,
          openPrice: currentCandlestick.openPrice,
          openTime: currentCandlestick.openTime,
          quoteAssetVolume: currentCandlestick.quoteAssetVolume,
          tradesCount: currentCandlestick.tradesCount,
        };
      }),
    });
  }

  async getCandlesticks(
    tradingPairId: number,
    queryDto: CursorBasedQueryOptionsDto<Candlestick>,
  ) {
    const pageSize = queryDto.pageSize ?? PAGE_SIZE;
    const cursorDirection = queryDto.cursor?.direction ?? CURSOR_DIRECTION;
    const take = cursorDirection === 'backwards' ? -pageSize : +pageSize;

    return await this.prisma.candlestick.findMany({
      where: {
        ...queryDto.filters,
        tradingPairId,
      },
      ...(queryDto.cursor?.value && {
        cursor: {
          id: queryDto.cursor?.value,
        },
      }),
      take,
      orderBy: {
        id: 'asc',
      },
    });
  }

  async addTrades(tradingPairId: number, trades: Trade[]) {
    if (trades.length === 0) {
      return;
    }

    const candlestickLock = await this.acquireCandlestickLock(tradingPairId);

    try {
      const currentCandlestick = await this.getOrBuildCurrentCandlestick(
        tradingPairId,
        CandlestickInterval.OneHour,
      );

      const updatedCandlestick = this.buildUpdatedCandlestick(
        currentCandlestick,
        trades,
      );

      await this.redis.set(
        this.buildTradingPairCandlestickKey(tradingPairId),
        JSON.stringify(updatedCandlestick),
      );
    } finally {
      await candlestickLock.release();
    }
  }

  async getOrBuildCurrentCandlestick(
    tradingPairId: number,
    interval: CandlestickInterval = 'OneHour',
  ): Promise<CurrentCandlestickDto> {
    const currentCandlestickJson = await this.redis.get(
      this.buildTradingPairCandlestickKey(tradingPairId),
    );

    let currentCandlestick: CurrentCandlestickDto;

    if (currentCandlestickJson !== null) {
      currentCandlestick = CurrentCandlestickSchema.parse(
        JSON.parse(currentCandlestickJson),
      );
    } else {
      currentCandlestick = this.buildInitialCandlestick(interval);
    }

    return currentCandlestick;
  }

  private async acquireCandlestickLock(tradingPairId: number) {
    return await this.redlock.acquire(
      [`candlestick-lock:${tradingPairId}`],
      3000,
    );
  }

  private async openNewCandlestick(
    tradingPairId: number,
    interval: CandlestickInterval,
  ): Promise<CurrentCandlestickDto> {
    const candlestickLock = await this.acquireCandlestickLock(tradingPairId);

    try {
      const currentCandlestick = await this.getOrBuildCurrentCandlestick(
        tradingPairId,
        interval,
      );

      const newCandlestick: CurrentCandlestickDto = {
        openPrice: currentCandlestick.lastTradePrice,
        openTime: this.getOpenTimeForInterval(interval),
        lowestPrice: currentCandlestick.lastTradePrice,
        highestPrice: currentCandlestick.lastTradePrice,
        baseAssetVolume: new Decimal(0),
        quoteAssetVolume: new Decimal(0),
        tradesCount: 0,
        lastTradeId: currentCandlestick.lastTradeId,
        lastTradePrice: currentCandlestick.lastTradePrice,
      };

      await this.redis.set(
        this.buildTradingPairCandlestickKey(tradingPairId),
        JSON.stringify(newCandlestick),
      );

      return currentCandlestick;
    } finally {
      await candlestickLock.release();
    }
  }

  private buildInitialCandlestick(
    interval: CandlestickInterval,
  ): CurrentCandlestickDto {
    return {
      openPrice: new Decimal(0),
      openTime: this.getOpenTimeForInterval(interval),
      lowestPrice: new Decimal(0),
      highestPrice: new Decimal(0),
      baseAssetVolume: new Decimal(0),
      quoteAssetVolume: new Decimal(0),
      tradesCount: 0,
      lastTradeId: 0,
      lastTradePrice: new Decimal(0),
    };
  }

  private getOpenTimeForInterval(interval: CandlestickInterval): Date {
    if (interval === 'OneHour') {
      return moment.utc().startOf('hour').toDate();
    }

    return new Date();
  }

  private buildUpdatedCandlestick(
    candlestick: CurrentCandlestickDto,
    trades: Trade[],
  ): CurrentCandlestickDto {
    const candlestickAggregateDto = this.aggregateTrades(trades);

    return {
      openPrice: candlestick.openPrice,
      openTime: candlestick.openTime,
      lowestPrice: Decimal.min(
        candlestick.lowestPrice,
        candlestickAggregateDto.lowestPrice,
      ),
      highestPrice: Decimal.max(
        candlestick.highestPrice,
        candlestickAggregateDto.highestPrice,
      ),
      baseAssetVolume: candlestick.baseAssetVolume.add(
        candlestickAggregateDto.baseAssetVolume,
      ),
      quoteAssetVolume: candlestick.quoteAssetVolume.add(
        candlestickAggregateDto.quoteAssetVolume,
      ),
      tradesCount:
        candlestick.tradesCount + candlestickAggregateDto.tradesCount,
      lastTradeId: candlestickAggregateDto.lastTradeId,
      lastTradePrice: candlestickAggregateDto.lastTradePrice,
    };
  }

  private aggregateTrades(trades: Trade[]): CandlestickAggregateDto {
    const lastTrade = maxBy(trades, (trade) => trade.id);

    if (!lastTrade) {
      throw new UnreachableCodeException();
    }

    return {
      lowestPrice: Decimal.min(...trades.map((trade) => trade.price)),
      highestPrice: Decimal.max(...trades.map((trade) => trade.price)),
      baseAssetVolume: Decimal.sum(...trades.map((trade) => trade.quantity)),
      quoteAssetVolume: Decimal.sum(
        ...trades.map((trade) => trade.quantity.times(trade.price)),
      ),
      tradesCount: trades.length,
      lastTradeId: lastTrade.id,
      lastTradePrice: lastTrade.price,
    };
  }

  private buildTradingPairCandlestickKey(tradingPairId: number) {
    return `candlestick:${tradingPairId}`;
  }
}
