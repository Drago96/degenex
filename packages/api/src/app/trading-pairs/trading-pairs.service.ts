import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { TradingPairResponseDto } from './trading-pair-response.dto';

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
          },
        },
        currency: {
          select: {
            id: true,
            code: true,
          },
        },
      },
    });
  }
}
