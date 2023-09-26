import {
  Controller,
  Query,
  Param,
  Sse,
  MessageEvent,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { interval, map, Observable, withLatestFrom } from 'rxjs';

import { TradingPairResponseDto } from '@degenex/common';
import { TradingPairsStatisticStreamService } from './trading-pairs-statistics-stream.service';
import { TradingPairsService } from './trading-pairs.service';

@Controller('trading-pairs')
export class TradingPairsController {
  constructor(
    private tradingPairsService: TradingPairsService,
    private tradingPairsStatisticsStreamService: TradingPairsStatisticStreamService,
  ) {}

  @Get()
  @ZodSerializerDto(TradingPairResponseDto)
  async getAll(): Promise<TradingPairResponseDto[]> {
    return this.tradingPairsService.getAll();
  }

  @Sse('track-statistics')
  trackPrices(@Query('ids') ids: number[]): Observable<MessageEvent> {
    return interval(1000).pipe(
      withLatestFrom(
        this.tradingPairsStatisticsStreamService.getTradingPairsStatistics$(
          ids,
        ),
      ),
      map(([_, tradingPairStatistics]) => ({
        data: tradingPairStatistics,
      })),
    );
  }

  @Get(':id')
  @ZodSerializerDto(TradingPairResponseDto)
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return this.tradingPairsService.getById(id);
  }
}
