import { Module } from '@nestjs/common';

import { OrderBookModule } from '@/order-book/order-book.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [OrderBookModule],
  exports: [OrdersService],
})
export class OrdersModule {}
