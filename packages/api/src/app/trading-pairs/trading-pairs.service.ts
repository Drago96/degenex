import { Injectable } from '@nestjs/common';
import moment from 'moment';

import { Decimal } from '@prisma/client/runtime/library';
import { TradingPairResponseDto } from '@degenex/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TradingPairsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<TradingPairResponseDto[]> {
    return this.prisma.tradingPair.findMany({
      select: {
        id: true,
        baseAsset: {
          select: {
            id: true,
            tickerSymbol: true,
            type: true,
            logoUrl: true,
          },
        },
        quoteAsset: {
          select: {
            id: true,
            tickerSymbol: true,
            currencySymbol: true,
          },
        },
      },
    });
  }

  async getPreviousPrice(tradingPairId: number) {
    let priceChangeTrade = await this.prisma.trade.findFirst({
      orderBy: {
        id: 'desc',
      },
      where: {
        makerOrder: {
          tradingPairId,
        },
        createdAt: {
          lte: moment().subtract(1, 'day').toDate(),
        },
      },
      select: {
        price: true,
      },
    });

    if (!priceChangeTrade) {
      priceChangeTrade = await this.prisma.trade.findFirst({
        orderBy: {
          id: 'asc',
        },
        where: {
          makerOrder: {
            tradingPairId,
          },
        },
        select: {
          price: true,
        },
      });
    }

    return priceChangeTrade?.price ?? new Decimal(0);
  }
}
