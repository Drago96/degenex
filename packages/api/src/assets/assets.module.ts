import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AssetPricesStreamService } from './asset-prices-stream.service';
import { AssetsController } from './assets.controller';
import { TwelveDataConfigService } from './twelve-data.config-service';
import { TwelveDataService } from './twelve-data.service';
import { AssetPricesCacheService } from './asset-prices-cache.service';

@Module({
  imports: [HttpModule.registerAsync({ useClass: TwelveDataConfigService })],
  providers: [
    AssetPricesStreamService,
    AssetPricesCacheService,
    TwelveDataService,
  ],
  controllers: [AssetsController],
})
export class AssetsModule {}
