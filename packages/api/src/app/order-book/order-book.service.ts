import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { flatten, groupBy, zip } from 'lodash';
import Redlock from 'redlock';

import { Order, OrderSide } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  OrderBookEntryDto,
  OrderBookEntrySchema,
} from './order-book-entry.dto';
import { OrderBookTradeDto } from './order-book-trade.dto';
import { OrderBookDepthDto } from './order-book-depth.dto';

@Injectable()
export class OrderBookService {
  private redlock: Redlock;

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {
    this.redlock = new Redlock([redis]);
  }

  async placeOrder(takerOrder: Order) {
    const orderBookLock = await this.acquireOrderBookLock(
      takerOrder.tradingPairId,
    );

    try {
      const orderBookTrades = await this.attemptOrderFill(takerOrder);

      const totalTradedQuantity =
        orderBookTrades.length === 0
          ? new Decimal(0)
          : Decimal.sum(...orderBookTrades.map((trade) => trade.quantity));

      const isOrderFilled = totalTradedQuantity.equals(takerOrder.quantity);

      if (!isOrderFilled) {
        if (takerOrder.type === 'Market') {
          throw new BadRequestException('Insufficient liquidity');
        }

        const remainingQuantity =
          takerOrder.quantity.minus(totalTradedQuantity);

        await this.enqueueOrder(takerOrder, remainingQuantity);
      }

      const filledOrderBookIds = orderBookTrades
        .filter((trade) => trade.makerOrder.remainingQuantity.equals(0))
        .map((trade) => trade.makerOrder.orderBookId);

      if (filledOrderBookIds.length > 0) {
        await this.removeOrders(
          filledOrderBookIds,
          takerOrder.tradingPairId,
          takerOrder.side === 'Buy' ? 'Sell' : 'Buy',
        );
      }

      const partiallyFilledTrades = orderBookTrades.filter(
        (trade) => !trade.makerOrder.remainingQuantity.equals(0),
      );

      if (partiallyFilledTrades.length > 0) {
        await this.updateOrderQuantities(
          partiallyFilledTrades,
          takerOrder.tradingPairId,
        );
      }

      return {
        isOrderFilled,
        orderBookTrades,
      };
    } finally {
      await orderBookLock.release();
    }
  }

  async getDepth(
    tradingPairId: number,
    orderSide: OrderSide,
    targetPrice: Decimal,
  ): Promise<OrderBookDepthDto[]> {
    let orderBookIds: string[];

    if (orderSide === 'Buy') {
      orderBookIds = await this.getBuyOrderBookIds(tradingPairId, targetPrice);
    } else {
      orderBookIds = await this.getSellOrderBookIds(tradingPairId, targetPrice);
    }

    if (orderBookIds.length === 0) {
      return [];
    }

    const ordersJson = await this.redis.hmget(
      this.buildTradingPairOrdersKey(tradingPairId),
      ...orderBookIds,
    );

    const orderEntries: OrderBookEntryDto[] = ordersJson.map((orderJson) => {
      if (orderJson === null) {
        throw new InternalServerErrorException();
      }

      return OrderBookEntrySchema.parse(JSON.parse(orderJson));
    });

    const ordersByPrice = groupBy(
      zip(
        orderEntries.map((orderEntry) => orderEntry.price),
        orderEntries.map((orderEntry) => orderEntry.remainingQuantity),
      ),
      (zippedOrder) => zippedOrder.at(0)?.toString(),
    );

    const orderBookDepth = Object.entries(ordersByPrice).map(
      ([price, orders]) => {
        return {
          price: new Decimal(price),
          quantity: Decimal.sum(
            ...orders.map(([_, quantity]) => new Decimal(quantity!)),
          ),
        };
      },
    );

    return orderBookDepth;
  }

  private async acquireOrderBookLock(tradingPairId: number) {
    return await this.redlock.acquire(
      [`trading-pair-order-book:${tradingPairId}`],
      3000,
    );
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
          currentOrderbookIndex,
        );
      } else {
        currentOrderBookTrade = await this.buildSellOrderTrade(
          takerOrder,
          remainingQuantity,
          currentOrderbookIndex,
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
    orderBookIndex: number,
  ) {
    const makerOrderBookId = await this.getSellOrderBookId(
      buyOrder.tradingPairId,
      orderBookIndex,
    );

    if (makerOrderBookId === null) {
      return null;
    }

    const makerOrderJson = await this.redis.hget(
      this.buildTradingPairOrdersKey(buyOrder.tradingPairId),
      makerOrderBookId,
    );

    if (makerOrderJson === null) {
      throw new InternalServerErrorException();
    }

    const makerOrder: OrderBookEntryDto = OrderBookEntrySchema.parse(
      JSON.parse(makerOrderJson),
    );

    if (
      buyOrder.type === 'Limit' &&
      buyOrder.price.lessThan(makerOrder.price)
    ) {
      return null;
    }

    const orderBookTrade = await this.buildTrade(
      makerOrderBookId,
      makerOrder,
      remainingQuantity,
    );

    return orderBookTrade;
  }

  private async buildSellOrderTrade(
    sellOrder: Order,
    remainingQuantity: Decimal,
    orderBookIndex: number,
  ) {
    const makerOrderBookId = await this.getBuyOrderBookId(
      sellOrder.tradingPairId,
      orderBookIndex,
    );

    if (makerOrderBookId === null) {
      return null;
    }

    const makerOrderJson = await this.redis.hget(
      this.buildTradingPairOrdersKey(sellOrder.tradingPairId),
      makerOrderBookId,
    );

    if (makerOrderJson === null) {
      throw new InternalServerErrorException();
    }

    const makerOrder: OrderBookEntryDto = OrderBookEntrySchema.parse(
      JSON.parse(makerOrderJson),
    );

    if (
      sellOrder.type === 'Limit' &&
      sellOrder.price.greaterThan(makerOrder.price)
    ) {
      return null;
    }

    const orderBookTrade = await this.buildTrade(
      makerOrderBookId,
      makerOrder,
      remainingQuantity,
    );

    return orderBookTrade;
  }

  private async getSellOrderBookId(
    tradingPairId: number,
    orderBookIndex: number,
  ): Promise<string | null> {
    const sellOrder = await this.redis.zrange(
      this.buildTradingPairOrderBookKey(tradingPairId, 'Sell'),
      orderBookIndex,
      orderBookIndex,
    );

    if (sellOrder.length === 0) {
      return null;
    }

    const [orderBookId] = sellOrder;

    return orderBookId;
  }

  private async getSellOrderBookIds(
    tradingPairId: number,
    ceilingPrice: Decimal,
  ): Promise<string[]> {
    const orderBookIds = await this.redis.zrange(
      this.buildTradingPairOrderBookKey(tradingPairId, 'Sell'),
      '-inf',
      ceilingPrice.toString(),
      'BYSCORE',
    );

    return orderBookIds;
  }

  private async getBuyOrderBookId(
    tradingPairId: number,
    orderBookIndex: number,
  ): Promise<string | null> {
    const buyOrder = await this.redis.zrange(
      this.buildTradingPairOrderBookKey(tradingPairId, 'Buy'),
      orderBookIndex,
      orderBookIndex,
    );

    if (buyOrder.length === 0) {
      return null;
    }

    const [orderBookId] = buyOrder;

    return orderBookId;
  }

  private async getBuyOrderBookIds(
    tradingPairId: number,
    floorPrice: Decimal,
  ): Promise<string[]> {
    const orderBookIds = await this.redis.zrange(
      this.buildTradingPairOrderBookKey(tradingPairId, 'Buy'),
      '-inf',
      floorPrice.negated().toString(),
      'BYSCORE',
    );

    return orderBookIds;
  }

  private async buildTrade(
    makerOrderBookId: string,
    makerOrder: OrderBookEntryDto,
    takerOrderQuantity: Decimal,
  ): Promise<OrderBookTradeDto> {
    const quantityToExecute = Decimal.min(
      takerOrderQuantity,
      makerOrder.remainingQuantity,
    );

    return {
      price: makerOrder.price,
      quantity: quantityToExecute,
      makerOrder: {
        id: makerOrder.orderId,
        userId: makerOrder.userId,
        orderBookId: makerOrderBookId,
        remainingQuantity: makerOrder.remainingQuantity.sub(quantityToExecute),
      },
    };
  }

  private async enqueueOrder(order: Order, remainingQuantity: Decimal) {
    const orderBookDto: OrderBookEntryDto = {
      orderId: order.id,
      userId: order.userId,
      price: order.price,
      remainingQuantity,
    };

    const orderPriceKey =
      order.side === 'Buy'
        ? order.price.negated().toString()
        : order.price.toString();

    await this.redis
      .multi()
      .zadd(
        this.buildTradingPairOrderBookKey(order.tradingPairId, order.side),
        orderPriceKey,
        order.orderBookId,
      )
      .hset(
        this.buildTradingPairOrdersKey(order.tradingPairId),
        order.orderBookId,
        JSON.stringify(orderBookDto),
      )
      .exec();
  }

  private async removeOrders(
    orderBookIds: string[],
    tradingPairId: number,
    orderSide: OrderSide,
  ) {
    await this.redis
      .multi()
      .zrem(
        this.buildTradingPairOrderBookKey(tradingPairId, orderSide),
        ...orderBookIds,
      )
      .hdel(this.buildTradingPairOrdersKey(tradingPairId), ...orderBookIds)
      .exec();
  }

  private async updateOrderQuantities(
    orderBookTrades: OrderBookTradeDto[],
    tradingPairId: number,
  ) {
    const orderEntries = orderBookTrades.map((orderBookTrade) => {
      const orderBookDto: OrderBookEntryDto = {
        orderId: orderBookTrade.makerOrder.id,
        userId: orderBookTrade.makerOrder.userId,
        price: orderBookTrade.price,
        remainingQuantity: orderBookTrade.makerOrder.remainingQuantity,
      };

      return [
        orderBookTrade.makerOrder.orderBookId,
        JSON.stringify(orderBookDto),
      ];
    });

    await this.redis.hset(
      this.buildTradingPairOrdersKey(tradingPairId),
      ...flatten(orderEntries),
    );
  }

  private buildTradingPairOrdersKey(tradingPairId: number) {
    return `trading-pair-orders:${tradingPairId}`;
  }

  private buildTradingPairOrderBookKey(tradingPairId: number, side: OrderSide) {
    return `trading-pair-order-book:${tradingPairId}:${side}`;
  }
}
