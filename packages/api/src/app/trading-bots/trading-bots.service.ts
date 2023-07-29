import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { Decimal } from '@prisma/client/runtime/library';
import { TradingPairsPriceCacheService } from '@/trading-pairs/trading-pairs-price-cache.service';
import { PrismaService } from '@/prisma/prisma.service';
import { TradingPairsService } from '@/trading-pairs/trading-pairs.service';
import { OrderBookService } from '@/order-book/order-book.service';
import { OrderSide } from '@prisma/client';
import { TradingPairWithAssociations } from '@/trading-pairs/trading-pair-with-associations';
import { OrdersService } from '@/orders/orders.service';

const BUY_BOT_EMAIL = 'buy.bot@gmail.com';
const SELL_BOT_EMAIL = 'sell.bot@gmail.com';

@Injectable()
export class TradingBotsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tradingPairsService: TradingPairsService,
    private readonly tradingPairsPriceCacheService: TradingPairsPriceCacheService,
    private readonly ordersService: OrdersService,
    private readonly orderBookService: OrderBookService
  ) {}

  @Interval(1000)
  async simulateTrades() {
    const tradingPairs = await this.prisma.tradingPair.findMany({
      include: {
        baseAsset: true,
        quoteAsset: true,
      },
    });

    for (const tradingPair of tradingPairs) {
      const cachedTradingPairPrice =
        await this.tradingPairsPriceCacheService.getCachedTradingPairPrice(
          tradingPair
        );

      const latestTradingPairPrice =
        await this.tradingPairsService.getTradingPairPrice(tradingPair.id);

      await this.simulateTrade(
        tradingPair,
        latestTradingPairPrice,
        this.generateApproximateTradingPairPrice(cachedTradingPairPrice ?? 0)
      );
    }
  }

  private async simulateTrade(
    tradingPair: TradingPairWithAssociations,
    currentPrice: Decimal,
    targetPrice: Decimal
  ) {
    if (currentPrice.equals(targetPrice)) {
      return;
    }

    const makerSide: OrderSide = currentPrice.greaterThan(targetPrice)
      ? 'Buy'
      : 'Sell';

    const orderBookDepth = await this.orderBookService.getDepth(
      tradingPair.id,
      makerSide,
      targetPrice
    );

    const orderBookQuantity = Decimal.sum(
      new Decimal(0),
      ...orderBookDepth.map((orderBookDepthDto) => orderBookDepthDto.quantity)
    );

    const makerBotQuantity = new Decimal(1);
    const takerBotQuantity = new Decimal(1).add(orderBookQuantity);

    await this.placeBotOrder(
      tradingPair,
      'Buy',
      targetPrice,
      'Buy' === makerSide ? makerBotQuantity : takerBotQuantity
    );

    await this.placeBotOrder(
      tradingPair,
      'Sell',
      targetPrice,
      'Sell' === makerSide ? makerBotQuantity : takerBotQuantity
    );
  }

  private async placeBotOrder(
    tradingPair: TradingPairWithAssociations,
    botOrderSide: OrderSide,
    orderPrice: Decimal,
    orderQuantity: Decimal
  ) {
    const botUser = await this.prisma.user.findUnique({
      where: {
        email: botOrderSide === 'Buy' ? BUY_BOT_EMAIL : SELL_BOT_EMAIL,
      },
      select: {
        id: true,
      },
    });

    if (botUser === null) {
      throw new InternalServerErrorException();
    }

    await this.prepareBotAssetBalances(
      botUser.id,
      tradingPair,
      botOrderSide,
      orderPrice,
      orderQuantity
    );

    await this.ordersService.createOrder(botUser.id, {
      price: orderPrice.toNumber(),
      quantity: orderQuantity.toNumber(),
      side: botOrderSide,
      tradingPairId: tradingPair.id,
      type: 'Limit',
    });
  }

  private async prepareBotAssetBalances(
    botUserId: number,
    tradingPair: TradingPairWithAssociations,
    botOrderSide: OrderSide,
    orderPrice: Decimal,
    orderQuantity: Decimal
  ) {
    const tickerSymbolToFund =
      botOrderSide === 'Buy'
        ? tradingPair.quoteAsset.tickerSymbol
        : tradingPair.baseAsset.tickerSymbol;

    const amountToFund =
      botOrderSide === 'Buy' ? orderPrice.times(orderQuantity) : orderQuantity;

    await this.prisma.assetBalance.upsert({
      where: {
        userId_assetTickerSymbol: {
          userId: botUserId,
          assetTickerSymbol: tickerSymbolToFund,
        },
      },
      update: {
        available: amountToFund,
        locked: 0,
      },
      create: {
        available: amountToFund,
        userId: botUserId,
        assetTickerSymbol: tickerSymbolToFund,
      },
    });

    const tickerSymbolToReset =
      botOrderSide === 'Buy'
        ? tradingPair.baseAsset.tickerSymbol
        : tradingPair.quoteAsset.tickerSymbol;

    await this.prisma.assetBalance.upsert({
      where: {
        userId_assetTickerSymbol: {
          userId: botUserId,
          assetTickerSymbol: tickerSymbolToReset,
        },
      },
      update: {
        available: 0,
        locked: 0,
      },
      create: {
        available: 0,
        userId: botUserId,
        assetTickerSymbol: tickerSymbolToReset,
      },
    });
  }

  private generateApproximateTradingPairPrice(cachedTradingPairPrice: number) {
    const maxPrice =
      cachedTradingPairPrice + (1 / 100) * cachedTradingPairPrice;
    const minPrice =
      cachedTradingPairPrice - (1 / 100) * cachedTradingPairPrice;

    return new Decimal(
      Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice
    );
  }
}
