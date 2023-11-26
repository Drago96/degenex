import { Module } from '@nestjs/common';

import { CandlesticksService } from './candlesticks.service';
import { CandlesticksController } from './candlesticks.controller';

@Module({
  providers: [CandlesticksService],
  exports: [CandlesticksService],
  controllers: [CandlesticksController],
})
export class CandlesticksModule {}
