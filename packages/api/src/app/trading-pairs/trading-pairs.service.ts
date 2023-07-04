import { Injectable } from '@nestjs/common';

import { TradingPairResponseDto } from '@degenex/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TradingPairsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<TradingPairResponseDto[]> {
    return this.prisma.tradingPair.findMany({
      select: {
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
}
