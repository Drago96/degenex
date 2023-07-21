import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrderBookService } from '@/order-book/order-book.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderCreateDto } from './order-create.dto';

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
            orderCreateDto.side === 'Sell'
              ? tradingPair.baseAssetTickerSymbol
              : tradingPair.quoteAssetTickerSymbol;

          const orderAmount =
            orderCreateDto.side === 'Sell'
              ? orderCreateDto.quantity
              : orderCreateDto.price * orderCreateDto.quantity;

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
          throw new BadRequestException('Insufficient balance');
        }

        const order = await tx.order.create({
          data: {
            side: orderCreateDto.side,
            type: orderCreateDto.type,
            quantity: orderCreateDto.quantity,
            price: orderCreateDto.price,
            tradingPairId: orderCreateDto.tradingPairId,
            userId,
          },
        });

        await this.orderBookService.placeOrder(order);

        return order;
      },
      {
        isolationLevel: 'RepeatableRead',
      }
    );
  }
}
