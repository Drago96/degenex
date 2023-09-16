import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TradingPairsStatisticStreamService } from './trading-pairs-statistics-stream.service';
import { TradingPairsController } from './trading-pairs.controller';
import { TwelveDataConfigService } from './twelve-data.config-service';
import { TwelveDataService } from './twelve-data.service';
import { TradingPairsPriceCacheService } from './trading-pairs-price-cache.service';
import { TradingPairsService } from './trading-pairs.service';
import { CandlesticksModule } from '@/candlesticks/candlesticks.module';

@Module({
  imports: [
    HttpModule.registerAsync({ useClass: TwelveDataConfigService }),
    CandlesticksModule,
  ],
  providers: [
    TradingPairsService,
    TradingPairsStatisticStreamService,
    TradingPairsPriceCacheService,
    TwelveDataService,
  ],
  exports: [TradingPairsService, TradingPairsPriceCacheService],
  controllers: [TradingPairsController],
})
export class TradingPairsModule {}
