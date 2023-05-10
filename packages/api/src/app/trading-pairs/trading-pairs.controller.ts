import { Controller, Query, Sse, MessageEvent } from '@nestjs/common';
import { interval, map, Observable, withLatestFrom } from 'rxjs';

import { TradingPairsPriceStreamService } from './trading-pairs-price-stream.service';

@Controller('trading-pairs')
export class TradingPairsController {
  constructor(
    private tradingPairPricesStreamService: TradingPairsPriceStreamService,
  ) {}

  @Sse('track-prices')
  trackPrices(
    @Query('tradingPairSymbols') tradingPairSymbols: string[],
  ): Observable<MessageEvent> {
    return interval(1000).pipe(
      withLatestFrom(
        this.tradingPairPricesStreamService.getPricesForTradingPairSymbols$(
          tradingPairSymbols,
        ),
      ),
      map(([_, tradingPairPrices]) => ({
        data: tradingPairPrices,
      })),
    );
  }
}
