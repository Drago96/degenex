import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { CandlesticksService } from './candlesticks.service';
import { Candlestick } from '@prisma/client';
import { CursorBasedQueryOptionsDto } from '@degenex/common';

@Controller('trading-pairs/:tradingPairId/candlesticks')
export class CandlesticksController {
  constructor(private readonly candlesticksService: CandlesticksService) {}

  @Get()
  async getMany(
    @Param('tradingPairId', new ParseIntPipe()) tradingPairId: number,
    @Query()
    queryDto: CursorBasedQueryOptionsDto<Candlestick>,
  ): Promise<Candlestick[]> {
    return await this.candlesticksService.getCandlesticks(
      tradingPairId,
      queryDto,
    );
  }
}
