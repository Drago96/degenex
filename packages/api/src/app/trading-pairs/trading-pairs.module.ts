import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TradingPairsPriceStreamService } from './trading-pairs-price-stream.service';
import { TradingPairsController } from './trading-pairs.controller';
import { TwelveDataConfigService } from './twelve-data.config-service';
import { TwelveDataService } from './twelve-data.service';
import { TradingPairsPriceCacheService } from './trading-pairs-price-cache.service';
import { TradingPairsService } from './trading-pairs.service';

@Module({
  imports: [HttpModule.registerAsync({ useClass: TwelveDataConfigService })],
  providers: [
    TradingPairsService,
    TradingPairsPriceStreamService,
    TradingPairsPriceCacheService,
    TwelveDataService,
  ],
  controllers: [TradingPairsController],
})
export class TradingPairsModule {}
