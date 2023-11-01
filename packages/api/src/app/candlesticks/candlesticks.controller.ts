import { Controller, Get } from '@nestjs/common';

import { CandlesticksService } from './candlesticks.service';
import { Candlestick } from '@prisma/client';

@Controller('candlesticks')
export class CandlesticksController {
  constructor(private readonly candlesticksService: CandlesticksService) {}

  @Get()
  async getMany(): Promise<Candlestick[]> {
    return [];
  }
}
