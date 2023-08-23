import { Module } from '@nestjs/common';

import { CandlesticksService } from './candlesticks.service';

@Module({
  providers: [CandlesticksService],
  exports: [CandlesticksService],
})
export class CandlesticksModule {}
