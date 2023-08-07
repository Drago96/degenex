import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { pick } from 'lodash';
import { map, Observable, scan, Subject } from 'rxjs';

import { TradingPairsPricesDto } from '@degenex/common';
import { PrismaService } from '../prisma/prisma.service';
import { TradingPairPriceUpdateDto } from './trading-pair-price-update.dto';
import { TradingPairsService } from './trading-pairs.service';

@Injectable()
export class TradingPairsPriceStreamService implements OnModuleDestroy {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tradingPairsService: TradingPairsService
  ) {}

  private tradingPairPriceUpdate$ = new Subject<TradingPairPriceUpdateDto>();
  private tradingPairsPrices$: Observable<TradingPairsPricesDto> =
    this.tradingPairPriceUpdate$.pipe(
      scan(
        (accumulatedTradingPairsPrice, tradingPairPriceUpdate) => ({
          ...accumulatedTradingPairsPrice,
          [tradingPairPriceUpdate.id]: tradingPairPriceUpdate.price,
        }),
        {}
      )
    );

  @Interval(1000)
  async updateTradingPairsPrices() {
    const tradingPairs = await this.prisma.tradingPair.findMany({
      include: {
        baseAsset: true,
        quoteAsset: true,
      },
    });

    await Promise.all(
      tradingPairs.map(async (tradingPair) => {
        const tradingPairPrice =
          await this.tradingPairsService.getTradingPairPrice(tradingPair.id);

        this.tradingPairPriceUpdate$.next({
          id: tradingPair.id,
          price: tradingPairPrice.toNumber(),
        });
      })
    );
  }

  getTradingPairsPrices$(tradingPairSymbols: number[]) {
    return this.tradingPairsPrices$.pipe(
      map((tradingPairsPrices) => pick(tradingPairsPrices, tradingPairSymbols))
    );
  }

  onModuleDestroy() {
    this.tradingPairPriceUpdate$.complete();
  }
}
