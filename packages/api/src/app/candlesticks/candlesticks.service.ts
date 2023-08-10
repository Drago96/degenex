import { Injectable } from '@nestjs/common';
import Redlock from 'redlock';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { Decimal } from '@prisma/client/runtime/library';
import { max } from 'lodash';

import { CandlestickAggregateDto } from './candlestick-aggregate.dto';
import { CandlestickInterval, Trade } from '@prisma/client';
import { CurrentCandlestickDto } from './current-candlestick.dto';
import moment from 'moment';

@Injectable()
export class CandlesticksService {
  private redlock: Redlock;

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {
    this.redlock = new Redlock([redis]);
  }

  async addTrades(tradingPairId: number, trades: Trade[]) {
    const candlestickLock = await this.acquireCandlestickLock(tradingPairId);

    try {
      const currentCandlestickJson = await this.redis.get(
        this.buildTradingPairCandlestickKey(tradingPairId),
      );

      let currentCandlestick: CurrentCandlestickDto;

      if (currentCandlestickJson !== null) {
        currentCandlestick = JSON.parse(currentCandlestickJson);
      } else {
        currentCandlestick = this.buildInitialCandlestick(
          CandlestickInterval.OneHour,
        );
      }

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

  private async acquireCandlestickLock(tradingPairId: number) {
    return await this.redlock.acquire([`candlestick:${tradingPairId}`], 3000);
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
    };
  }

  private aggregateTrades(trades: Trade[]): CandlestickAggregateDto {
    return {
      lowestPrice: Decimal.min(...trades.map((trade) => trade.price)),
      highestPrice: Decimal.max(...trades.map((trade) => trade.price)),
      baseAssetVolume: Decimal.sum(...trades.map((trade) => trade.quantity)),
      quoteAssetVolume: Decimal.sum(
        ...trades.map((trade) => trade.quantity.times(trade.price)),
      ),
      tradesCount: trades.length,
      lastTradeId: max(trades.map((trade) => trade.id))!,
    };
  }

  private buildTradingPairCandlestickKey(tradingPairId: number) {
    return `candlestick:${tradingPairId}`;
  }
}
