import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

import { Order, OrderSide } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { OrderBookEntryDto } from './order-book-entry.dto';
import { OrderBookTradeDto } from './order-book-trade.dto';

@Injectable()
export class OrderBookService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis
  ) {}

  async placeOrder(order: Order) {
    const orderBookTrades = await this.attemptOrderFill(order);

    const totalTradedQuantity =
      orderBookTrades.length === 0
        ? new Decimal(0)
        : Decimal.sum(...orderBookTrades.map((trade) => trade.quantity));

    if (totalTradedQuantity !== order.quantity) {
      if (order.type === 'Market') {
        throw new BadRequestException('Insufficient liquidity');
      }

      const remainingQuantity = order.quantity.minus(totalTradedQuantity);

      await this.enqueueOrder(order, order.side, remainingQuantity);
    }

    throw new BadRequestException('Temp exception');
  }

  private async attemptOrderFill(takerOrder: Order) {
    const orderBookTrades: OrderBookTradeDto[] = [];

    let remainingQuantity = takerOrder.quantity;

    while (remainingQuantity.greaterThan(0)) {
      let currentOrderBookTrade: OrderBookTradeDto | null;

      const currentOrderbookIndex = orderBookTrades.length;

      if (takerOrder.side === 'Buy') {
        currentOrderBookTrade = await this.buildBuyOrderTrade(
          takerOrder,
          remainingQuantity,
          currentOrderbookIndex
        );
      } else {
        currentOrderBookTrade = await this.buildSellOrderTrade(
          takerOrder,
          remainingQuantity,
          currentOrderbookIndex
        );
      }

      if (currentOrderBookTrade === null) {
        break;
      }

      orderBookTrades.push(currentOrderBookTrade);
      remainingQuantity = remainingQuantity.sub(currentOrderBookTrade.quantity);
    }

    return orderBookTrades;
  }

  private async buildBuyOrderTrade(
    buyOrder: Order,
    remainingQuantity: Decimal,
    orderBookIndex: number
  ) {
    const makerSellOrder = await this.getSellOrder(
      buyOrder.tradingPairId,
      orderBookIndex
    );

    if (makerSellOrder === null) {
      return null;
    }

    const [makerSellOrderBookId, sellPrice] = makerSellOrder;

    if (buyOrder.type === 'Limit' && buyOrder.price < new Decimal(sellPrice)) {
      return null;
    }

    const orderBookTrade = await this.buildTrade(
      buyOrder.tradingPairId,
      remainingQuantity,
      makerSellOrderBookId
    );

    return orderBookTrade;
  }

  private async buildSellOrderTrade(
    sellOrder: Order,
    remainingQuantity: Decimal,
    orderBookIndex: number
  ) {
    const makerBuyOrder = await this.getBuyOrder(
      sellOrder.tradingPairId,
      orderBookIndex
    );

    if (makerBuyOrder === null) {
      return null;
    }

    const [makerBuyOrderBookId, buyPrice] = makerBuyOrder;

    if (sellOrder.type === 'Limit' && sellOrder.price > new Decimal(buyPrice)) {
      return null;
    }

    const orderBookTrade = await this.buildTrade(
      sellOrder.tradingPairId,
      remainingQuantity,
      makerBuyOrderBookId
    );

    return orderBookTrade;
  }

  private async getSellOrder(
    tradingPairId: number,
    orderBookIndex: number
  ): Promise<[orderBookId: string, price: string] | null> {
    const sellOrder = await this.redis.zrange(
      this.buildTradingPairOrderBookKey(tradingPairId, 'Sell'),
      orderBookIndex,
      orderBookIndex,
      'WITHSCORES'
    );

    if (sellOrder.length === 0) {
      return null;
    }

    const [sellOrderBookId, sellPrice] = sellOrder;

    return [sellOrderBookId, sellPrice];
  }

  private async getBuyOrder(
    tradingPairId: number,
    orderBookIndex: number
  ): Promise<[orderBookId: string, price: string] | null> {
    const buyOrder = await this.redis.zrevrange(
      this.buildTradingPairOrderBookKey(tradingPairId, 'Buy'),
      orderBookIndex,
      orderBookIndex,
      'WITHSCORES'
    );

    if (buyOrder.length === 0) {
      return null;
    }

    const [buyOrderBookId, buyPrice] = buyOrder;

    return [buyOrderBookId, buyPrice];
  }

  private async buildTrade(
    tradingPairId: number,
    takerOrderQuantity: Decimal,
    makerOrderBookId: string
  ): Promise<OrderBookTradeDto> {
    const makerOrderJson = await this.redis.hget(
      this.buildTradingPairOrdersKey(tradingPairId),
      makerOrderBookId
    );

    if (makerOrderJson === null) {
      throw new InternalServerErrorException();
    }

    const makerOrder: OrderBookEntryDto = JSON.parse(makerOrderJson);

    const quantityToExecute = Decimal.min(
      takerOrderQuantity,
      new Decimal(makerOrder.remainingQuantity)
    );

    return {
      makerOrderId: makerOrder.orderId,
      makerOrderBookId,
      quantity: quantityToExecute,
      isMakerOrderFilled: quantityToExecute.equals(
        makerOrder.remainingQuantity
      ),
    };
  }

  private async enqueueOrder(
    order: Order,
    orderSide: OrderSide,
    remainingQuantity: Decimal
  ) {
    const orderBookDto: OrderBookEntryDto = {
      orderId: order.id,
      remainingQuantity,
    };

    await this.redis
      .multi()
      .zadd(
        this.buildTradingPairOrderBookKey(order.tradingPairId, orderSide),
        order.price.toString(),
        order.orderBookId
      )
      .hset(
        this.buildTradingPairOrdersKey(order.tradingPairId),
        order.orderBookId,
        JSON.stringify(orderBookDto)
      )
      .exec();
  }

  private buildTradingPairOrdersKey(tradingPairId: number) {
    return `trading-pair-orders:${tradingPairId}`;
  }

  private buildTradingPairOrderBookKey(tradingPairId: number, side: OrderSide) {
    return `trading-pair-order-book:${tradingPairId}:${side}`;
  }
}
