import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TradingPairsPriceStreamService } from './trading-pairs-price-stream.service';
import { TradingPairsController } from './trading-pairs.controller';
import { TwelveDataConfigService } from './twelve-data.config-service';
import { TwelveDataService } from './twelve-data.service';
import { TradingPairsPriceCacheService } from './trading-pairs-price-cache.service';

@Module({
  imports: [HttpModule.registerAsync({ useClass: TwelveDataConfigService })],
  providers: [
    TradingPairsPriceStreamService,
    TradingPairsPriceCacheService,
    TwelveDataService,
  ],
  controllers: [TradingPairsController],
})
export class TradingPairsModule {}
