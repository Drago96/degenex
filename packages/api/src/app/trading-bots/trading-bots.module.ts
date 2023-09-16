import { Module } from '@nestjs/common';

import { TradingPairsModule } from '@/trading-pairs/trading-pairs.module';
import { TradingBotsService } from './trading-bots.service';
import { OrderBookModule } from '@/order-book/order-book.module';
import { OrdersModule } from '@/orders/orders.module';
import { CandlesticksModule } from '@/candlesticks/candlesticks.module';

@Module({
  providers: [TradingBotsService],
  imports: [
    TradingPairsModule,
    CandlesticksModule,
    OrdersModule,
    OrderBookModule,
  ],
})
export class TradingBotsModule {}
