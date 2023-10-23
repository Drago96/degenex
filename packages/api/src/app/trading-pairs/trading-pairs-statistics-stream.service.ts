import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { pick } from 'lodash';
import { map, Observable, scan, Subject } from 'rxjs';

import {
  UpdateTradingPairStatisticsDto,
  TradingPairsStatisticsDto,
} from '@degenex/common';
import { PrismaService } from '../prisma/prisma.service';
import { TradingPairsService } from './trading-pairs.service';
import { CandlesticksService } from '@/candlesticks/candlesticks.service';

@Injectable()
export class TradingPairsStatisticStreamService implements OnModuleDestroy {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tradingPairsService: TradingPairsService,
    private readonly candleSticksService: CandlesticksService,
  ) {}

  private updateTradingPairStatistics$ =
    new Subject<UpdateTradingPairStatisticsDto>();
  private tradingPairsStatistics$: Observable<TradingPairsStatisticsDto> =
    this.updateTradingPairStatistics$.pipe(
      scan(
        (accumulatedTradingPairsPrice, updateTradingPairStatisticsDto) => ({
          ...accumulatedTradingPairsPrice,
          [updateTradingPairStatisticsDto.id]: updateTradingPairStatisticsDto,
        }),
        {},
      ),
    );

  @Interval(1000)
  async updateTradingPairsPrices() {
    const tradingPairs = await this.prisma.tradingPair.findMany();

    await Promise.all(
      tradingPairs.map(async (tradingPair) => {
        const currentCandlestick =
          await this.candleSticksService.getOrBuildCurrentCandlestick(
            tradingPair.id,
          );

        const previousTradingPairPrice =
          await this.tradingPairsService.getPreviousPrice(tradingPair.id);

        this.updateTradingPairStatistics$.next({
          id: tradingPair.id,
          priceChange: currentCandlestick.lastTradePrice.sub(
            previousTradingPairPrice,
          ),
          ...currentCandlestick,
        });
      }),
    );
  }

  getTradingPairsStatistics$(tradingPairIds: number[]) {
    return this.tradingPairsStatistics$.pipe(
      map((tradingPairsPrices) => pick(tradingPairsPrices, tradingPairIds)),
    );
  }

  onModuleDestroy() {
    this.updateTradingPairStatistics$.complete();
  }
}
