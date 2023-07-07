import { Module } from '@nestjs/common';

import { AssetBalancesController } from './asset-balances.controller';
import { AssetBalancesService } from './asset-balances.service';

@Module({
  controllers: [AssetBalancesController],
  providers: [AssetBalancesService],
})
export class AssetBalancesModule {}
