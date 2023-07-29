import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';

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

  async getTradingPairPrice(tradingPairId: number) {
    const latestTrade = await this.prisma.trade.findFirst({
      orderBy: {
        id: 'desc',
      },
      select: {
        price: true,
      },
      where: {
        makerOrder: {
          tradingPairId: tradingPairId,
        },
      },
    });

    return latestTrade?.price ?? new Decimal(0);
  }
}
