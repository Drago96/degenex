import { Module } from '@nestjs/common';

import { CandlesticksService } from './candlesticks.service';

@Module({
  providers: [CandlesticksService],
})
export class CandlesticksModule {}
