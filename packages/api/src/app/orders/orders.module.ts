import { Module } from '@nestjs/common';

import { OrderBookModule } from '@/order-book/order-book.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CandlesticksModule } from '@/candlesticks/candlesticks.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [OrderBookModule, CandlesticksModule],
  exports: [OrdersService],
})
export class OrdersModule {}
