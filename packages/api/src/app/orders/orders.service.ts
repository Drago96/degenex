import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrderBookService } from '@/order-book/order-book.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderCreateDto } from './order-create.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { isRecordNotFoundError } from '@/prisma/prisma-error.utils';
import { PrismaTransaction } from '@/types/prisma-transaction';
import { OrderBalanceTransferDto } from './order-balance-transfer.dto';
import { OrderBookTradeDto } from '@/order-book/order-book-trade.dto';
import { OrderSide } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderBookService: OrderBookService
  ) {}

  async createOrder(userId: number, orderCreateDto: OrderCreateDto) {
    const tradingPair = await this.prisma.tradingPair.findUnique({
      where: {
        id: orderCreateDto.tradingPairId,
      },
      select: {
        baseAssetTickerSymbol: true,
        quoteAssetTickerSymbol: true,
      },
    });

    if (!tradingPair) {
      throw new NotFoundException('Trading pair not found');
    }

    return this.prisma.$transaction(
      async (tx) => {
        await this.lockAssetsForOrder(userId, tradingPair, orderCreateDto, tx);

        const createdOrder = await tx.order.create({
          data: {
            side: orderCreateDto.side,
            type: orderCreateDto.type,
            quantity: orderCreateDto.quantity,
            price: orderCreateDto.price,
            tradingPairId: orderCreateDto.tradingPairId,
            userId,
          },
        });

        const { isOrderFilled, orderBookTrades } =
          await this.orderBookService.placeOrder(createdOrder);

        if (orderBookTrades.length === 0) {
          return createdOrder;
        }

        await tx.trade.createMany({
          data: orderBookTrades.map((trade) => ({
            takerOrderId: createdOrder.id,
            makerOrderId: trade.makerOrder.id,
            price: trade.price,
            quantity: trade.quantity,
          })),
        });

        await this.updateMakerOrders(
          orderBookTrades,
          tradingPair,
          orderCreateDto.side === 'Buy' ? 'Sell' : 'Buy',
          tx
        );

        const updatedOrder = await tx.order.update({
          where: {
            id: createdOrder.id,
          },
          data: {
            status: isOrderFilled ? 'Filled' : 'PartiallyFilled',
          },
        });

        await this.updateAssetBalance(
          {
            userId: userId,
            orderSide: orderCreateDto.side,
            baseAsset: {
              quantity: Decimal.sum(
                ...orderBookTrades.map((trade) => trade.quantity)
              ),
              tickerSymbol: tradingPair.baseAssetTickerSymbol,
            },
            quoteAsset: {
              amount: Decimal.sum(
                ...orderBookTrades.map((trade) =>
                  trade.quantity.times(trade.price)
                )
              ),
              tickerSymbol: tradingPair.quoteAssetTickerSymbol,
            },
          },
          tx
        );

        return updatedOrder;
      },
      {
        isolationLevel: 'RepeatableRead',
      }
    );
  }

  private async lockAssetsForOrder(
    userId: number,
    tradingPair: {
      quoteAssetTickerSymbol: string;
      baseAssetTickerSymbol: string;
    },
    orderCreateDto: OrderCreateDto,
    tx: PrismaTransaction
  ) {
    try {
      const assetBalanceTickerSymbol =
        orderCreateDto.side === 'Buy'
          ? tradingPair.quoteAssetTickerSymbol
          : tradingPair.baseAssetTickerSymbol;

      const orderAmount =
        orderCreateDto.side === 'Buy'
          ? new Decimal(orderCreateDto.price).times(
              new Decimal(orderCreateDto.quantity)
            )
          : orderCreateDto.quantity;

      const assetBalance = await tx.assetBalance.update({
        where: {
          userId_assetTickerSymbol: {
            userId,
            assetTickerSymbol: assetBalanceTickerSymbol,
          },
        },
        data: {
          available: {
            decrement: orderAmount,
          },
          locked: {
            increment: orderAmount,
          },
        },
      });

      if (assetBalance.available.lessThan(0)) {
        throw new BadRequestException('Insufficient balance');
      }
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new BadRequestException('Insufficient balance');
      }

      throw error;
    }
  }

  private async updateMakerOrders(
    orderBookTrades: OrderBookTradeDto[],
    tradingPair: {
      quoteAssetTickerSymbol: string;
      baseAssetTickerSymbol: string;
    },
    orderSide: OrderSide,
    tx: PrismaTransaction
  ) {
    await Promise.all(
      orderBookTrades.map(async (trade) => {
        await tx.order.updateMany({
          where: {
            id: trade.makerOrder.id,
            status: {
              not: 'Canceled',
            },
          },
          data: {
            status: trade.makerOrder.remainingQuantity.equals(0)
              ? 'Filled'
              : 'PartiallyFilled',
          },
        });

        await this.updateAssetBalance(
          {
            userId: trade.makerOrder.userId,
            orderSide,
            baseAsset: {
              quantity: trade.quantity,
              tickerSymbol: tradingPair.baseAssetTickerSymbol,
            },
            quoteAsset: {
              amount: trade.quantity.times(trade.price),
              tickerSymbol: tradingPair.quoteAssetTickerSymbol,
            },
          },
          tx
        );
      })
    );
  }

  private async updateAssetBalance(
    orderBalanceTransferDto: OrderBalanceTransferDto,
    tx: PrismaTransaction
  ) {
    await tx.assetBalance.upsert({
      where: {
        userId_assetTickerSymbol: {
          userId: orderBalanceTransferDto.userId,
          assetTickerSymbol: orderBalanceTransferDto.baseAsset.tickerSymbol,
        },
      },
      update: {
        ...(orderBalanceTransferDto.orderSide === 'Buy' && {
          available: {
            increment: orderBalanceTransferDto.baseAsset.quantity,
          },
        }),
        ...(orderBalanceTransferDto.orderSide === 'Sell' && {
          locked: {
            decrement: orderBalanceTransferDto.baseAsset.quantity,
          },
        }),
      },
      create: {
        available: orderBalanceTransferDto.baseAsset.quantity,
        userId: orderBalanceTransferDto.userId,
        assetTickerSymbol: orderBalanceTransferDto.baseAsset.tickerSymbol,
      },
    });

    await tx.assetBalance.upsert({
      where: {
        userId_assetTickerSymbol: {
          userId: orderBalanceTransferDto.userId,
          assetTickerSymbol: orderBalanceTransferDto.quoteAsset.tickerSymbol,
        },
      },
      update: {
        ...(orderBalanceTransferDto.orderSide === 'Sell' && {
          available: {
            increment: orderBalanceTransferDto.quoteAsset.amount,
          },
        }),
        ...(orderBalanceTransferDto.orderSide === 'Buy' && {
          locked: {
            decrement: orderBalanceTransferDto.quoteAsset.amount,
          },
        }),
      },
      create: {
        available: orderBalanceTransferDto.quoteAsset.amount,
        userId: orderBalanceTransferDto.userId,
        assetTickerSymbol: orderBalanceTransferDto.quoteAsset.tickerSymbol,
      },
    });
  }
}
