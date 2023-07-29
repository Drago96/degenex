import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrderBookService } from '@/order-book/order-book.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderCreateDto } from './order-create.dto';
import { Decimal } from '@prisma/client/runtime';
import { isRecordNotFoundError } from '@/prisma/prisma-error.utils';

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
        baseAssetTickerSymbol: orderCreateDto.side === 'Sell',
        quoteAssetTickerSymbol: orderCreateDto.side === 'Buy',
      },
    });

    if (!tradingPair) {
      throw new NotFoundException('Trading pair not found');
    }

    return this.prisma.$transaction(
      async (tx) => {
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

        const filledMakerOrderIds = orderBookTrades
          .filter((trade) => trade.makerOrder.remainingQuantity.equals(0))
          .map((trade) => trade.makerOrder.id);

        const partiallyFilledMakerOrderIds = orderBookTrades
          .filter((trade) => !trade.makerOrder.remainingQuantity.equals(0))
          .map((trade) => trade.makerOrder.id);

        if (filledMakerOrderIds.length > 0) {
          await tx.order.updateMany({
            where: {
              id: {
                in: filledMakerOrderIds,
              },
              status: {
                not: 'Canceled',
              },
            },
            data: {
              status: 'Filled',
            },
          });
        }

        if (partiallyFilledMakerOrderIds.length > 0) {
          await tx.order.updateMany({
            where: {
              id: {
                in: partiallyFilledMakerOrderIds,
              },
              status: {
                not: 'Canceled',
              },
            },
            data: {
              status: 'PartiallyFilled',
            },
          });
        }

        const updatedOrder = await tx.order.update({
          where: {
            id: createdOrder.id,
          },
          data: {
            status: isOrderFilled ? 'Filled' : 'PartiallyFilled',
          },
        });

        return updatedOrder;
      },
      {
        isolationLevel: 'RepeatableRead',
      }
    );
  }
}
