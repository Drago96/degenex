import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { chunk, flatten, groupBy, zip } from 'lodash';
import Redlock from 'redlock';

import { Order, OrderSide } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderBookEntryDto } from './order-book-entry.dto';
import { OrderBookTradeDto } from './order-book-trade.dto';
import { OrderBookDepthDto } from './order-book-depth.dto';
import { OrderBookLookupDto } from './order-book-lookup.dto';

@Injectable()
export class OrderBookService {
  private redlock: Redlock;

  constructor(
    @InjectRedis()
    private readonly redis: Redis
  ) {
    this.redlock = new Redlock([redis]);
  }

  async placeOrder(order: Order) {
    const orderBookLock = await this.acquireOrderBookLock(order.tradingPairId);

    try {
      const orderBookTrades = await this.attemptOrderFill(order);

      const totalTradedQuantity =
        orderBookTrades.length === 0
          ? new Decimal(0)
          : Decimal.sum(...orderBookTrades.map((trade) => trade.quantity));

      const isOrderFilled = totalTradedQuantity.equals(order.quantity);

      if (!isOrderFilled) {
        if (order.type === 'Market') {
          throw new BadRequestException('Insufficient liquidity');
        }

        const remainingQuantity = order.quantity.minus(totalTradedQuantity);

        await this.enqueueOrder(order, remainingQuantity);
      }

      const filledOrderBookIds = orderBookTrades
        .filter((trade) => trade.makerOrder.remainingQuantity.equals(0))
        .map((trade) => trade.makerOrder.orderBookId);

      if (filledOrderBookIds.length > 0) {
        await this.removeOrders(
          filledOrderBookIds,
          order.tradingPairId,
          order.side === 'Buy' ? 'Sell' : 'Buy'
        );
      }

      const partiallyFilledMakerOrders = orderBookTrades
        .filter((trade) => !trade.makerOrder.remainingQuantity.equals(0))
        .map((trade) => trade.makerOrder);

      if (partiallyFilledMakerOrders.length > 0) {
        await this.updateOrderQuantities(
          partiallyFilledMakerOrders,
          order.tradingPairId
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
    targetPrice: Decimal
  ): Promise<OrderBookDepthDto[]> {
    let orders: OrderBookLookupDto[];

    if (orderSide === 'Buy') {
      orders = await this.getBuyOrders(tradingPairId, targetPrice);
    } else {
      orders = await this.getSellOrders(tradingPairId, targetPrice);
    }

    if (orders.length === 0) {
      return [];
    }

    const ordersJson = await this.redis.hmget(
      this.buildTradingPairOrdersKey(tradingPairId),
      ...orders.map((order) => order.orderBookId)
    );

    const orderEntries: OrderBookEntryDto[] = ordersJson.map((orderJson) => {
      if (orderJson === null) {
        throw new InternalServerErrorException();
      }

      return JSON.parse(orderJson);
    });

    const ordersByPrice = groupBy(
      zip(
        orders.map((order) => order.price),
        orderEntries.map((orderEntry) => orderEntry.remainingQuantity)
      ),
      (zippedOrder) => zippedOrder.at(0)
    );

    const orderBookDepth = Object.entries(ordersByPrice).map(
      ([price, orders]) => {
        return {
          price: new Decimal(price),
          quantity: Decimal.sum(
            ...orders.map(([_, quantity]) => new Decimal(quantity!))
          ),
        };
      }
    );

    return orderBookDepth;
  }

  private async acquireOrderBookLock(tradingPairId: number) {
    return await this.redlock.acquire(
      [`trading-pair-order-book:${tradingPairId}`],
      3000
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

    const { orderBookId, price: sellPrice } = makerSellOrder;

    if (buyOrder.type === 'Limit' && buyOrder.price.lessThan(sellPrice)) {
      return null;
    }

    const orderBookTrade = await this.buildTrade(
      buyOrder.tradingPairId,
      remainingQuantity,
      sellPrice,
      orderBookId
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

    const { orderBookId, price: buyPrice } = makerBuyOrder;

    if (sellOrder.type === 'Limit' && sellOrder.price.greaterThan(buyPrice)) {
      return null;
    }

    const orderBookTrade = await this.buildTrade(
      sellOrder.tradingPairId,
      remainingQuantity,
      buyPrice,
      orderBookId
    );

    return orderBookTrade;
  }

  private async getSellOrder(
    tradingPairId: number,
    orderBookIndex: number
  ): Promise<OrderBookLookupDto | null> {
    const sellOrder = await this.redis.zrange(
      this.buildTradingPairOrderBookKey(tradingPairId, 'Sell'),
      orderBookIndex,
      orderBookIndex,
      'WITHSCORES'
    );

    if (sellOrder.length === 0) {
      return null;
    }

    const [orderBookId, price] = sellOrder;

    return {
      orderBookId: orderBookId,
      price: new Decimal(price),
    };
  }

  private async getSellOrders(
    tradingPairId: number,
    ceilingPrice: Decimal
  ): Promise<OrderBookLookupDto[]> {
    const sellOrders = await this.redis.zrange(
      this.buildTradingPairOrderBookKey(tradingPairId, 'Sell'),
      '-inf',
      ceilingPrice.toString(),
      'BYSCORE',
      'WITHSCORES'
    );

    return chunk(sellOrders, 2).map(([sellOrderBookId, sellPrice]) => ({
      orderBookId: sellOrderBookId,
      price: new Decimal(sellPrice),
    }));
  }

  private async getBuyOrder(
    tradingPairId: number,
    orderBookIndex: number
  ): Promise<OrderBookLookupDto | null> {
    const buyOrder = await this.redis.zrange(
      this.buildTradingPairOrderBookKey(tradingPairId, 'Buy'),
      orderBookIndex,
      orderBookIndex,
      'WITHSCORES'
    );

    if (buyOrder.length === 0) {
      return null;
    }

    const [orderBookId, price] = buyOrder;

    return { orderBookId, price: new Decimal(price).absoluteValue() };
  }

  private async getBuyOrders(
    tradingPairId: number,
    floorPrice: Decimal
  ): Promise<OrderBookLookupDto[]> {
    const buyOrders = await this.redis.zrange(
      this.buildTradingPairOrderBookKey(tradingPairId, 'Buy'),
      '-inf',
      floorPrice.negated().toString(),
      'BYSCORE',
      'WITHSCORES'
    );

    return chunk(buyOrders, 2).map(([orderBookId, price]) => ({
      orderBookId,
      price: new Decimal(price).absoluteValue(),
    }));
  }

  private async buildTrade(
    tradingPairId: number,
    takerOrderQuantity: Decimal,
    price: Decimal,
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
      price,
      quantity: quantityToExecute,
      makerOrder: {
        id: makerOrder.orderId,
        userId: makerOrder.userId,
        orderBookId: makerOrderBookId,
        remainingQuantity: new Decimal(makerOrder.remainingQuantity).sub(
          quantityToExecute
        ),
      },
    };
  }

  private async enqueueOrder(order: Order, remainingQuantity: Decimal) {
    const orderBookDto: OrderBookEntryDto = {
      orderId: order.id,
      userId: order.userId,
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
        order.orderBookId
      )
      .hset(
        this.buildTradingPairOrdersKey(order.tradingPairId),
        order.orderBookId,
        JSON.stringify(orderBookDto)
      )
      .exec();
  }

  private async removeOrders(
    orderBookIds: string[],
    tradingPairId: number,
    orderSide: OrderSide
  ) {
    await this.redis
      .multi()
      .zrem(
        this.buildTradingPairOrderBookKey(tradingPairId, orderSide),
        ...orderBookIds
      )
      .hdel(this.buildTradingPairOrdersKey(tradingPairId), ...orderBookIds)
      .exec();
  }

  private async updateOrderQuantities(
    orders: OrderBookTradeDto['makerOrder'][],
    tradingPairId: number
  ) {
    const orderEntries = orders.map((order) => {
      const orderBookDto: OrderBookEntryDto = {
        orderId: order.id,
        userId: order.userId,
        remainingQuantity: order.remainingQuantity,
      };

      return [order.orderBookId, JSON.stringify(orderBookDto)];
    });

    await this.redis.hset(
      this.buildTradingPairOrdersKey(tradingPairId),
      ...flatten(orderEntries)
    );
  }

  private buildTradingPairOrdersKey(tradingPairId: number) {
    return `trading-pair-orders:${tradingPairId}`;
  }

  private buildTradingPairOrderBookKey(tradingPairId: number, side: OrderSide) {
    return `trading-pair-order-book:${tradingPairId}:${side}`;
  }
}
