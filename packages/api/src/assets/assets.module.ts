import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { TwelveDataConfigService } from './twelve-data.config-service';
import { TwelveDataService } from './twelve-data.service';

@Module({
  imports: [HttpModule.registerAsync({ useClass: TwelveDataConfigService })],
  providers: [AssetsService, TwelveDataService],
  controllers: [AssetsController],
})
export class AssetsModule {}
