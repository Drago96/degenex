import { Injectable } from '@nestjs/common';

import { TradingPairResponseDto } from '@degenex/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TradingPairsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<TradingPairResponseDto[]> {
    return this.prisma.tradingPair.findMany({
      select: {
        asset: {
          select: {
            id: true,
            tickerSymbol: true,
            type: true,
            logoUrl: true,
          },
        },
        currency: {
          select: {
            id: true,
            code: true,
            symbol: true,
          },
        },
      },
    });
  }
}
