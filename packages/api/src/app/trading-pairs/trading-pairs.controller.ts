import { Controller, Query, Sse, MessageEvent, Get } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { interval, map, Observable, withLatestFrom } from 'rxjs';

import { TradingPairResponseDto } from '@degenex/common';
import { TradingPairsPriceStreamService } from './trading-pairs-price-stream.service';
import { TradingPairsService } from './trading-pairs.service';

@Controller('trading-pairs')
export class TradingPairsController {
  constructor(
    private tradingPairsService: TradingPairsService,
    private tradingPairPricesStreamService: TradingPairsPriceStreamService
  ) {}

  @Get()
  @ZodSerializerDto(TradingPairResponseDto)
  async getAll(): Promise<TradingPairResponseDto[]> {
    return this.tradingPairsService.getAll();
  }

  @Sse('track-prices')
  trackPrices(
    @Query('tradingPairSymbols') tradingPairSymbols: string[]
  ): Observable<MessageEvent> {
    return interval(1000).pipe(
      withLatestFrom(
        this.tradingPairPricesStreamService.getPricesForTradingPairSymbols$(
          tradingPairSymbols
        )
      ),
      map(([_, tradingPairPrices]) => ({
        data: tradingPairPrices,
      }))
    );
  }
}
