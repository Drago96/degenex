import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { AssetType } from '@prisma/client';
import { AssetBalanceResponseDto } from '@degenex/common';

@Injectable()
export class AssetBalancesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMany(
    userId: number,
    assetType: AssetType | null,
  ): Promise<AssetBalanceResponseDto[]> {
    const assets = await this.prisma.asset.findMany({
      where: {
        ...(assetType && { type: assetType }),
      },
      select: {
        id: true,
        logoUrl: true,
        tickerSymbol: true,
        fullName: true,
        userBalances: {
          select: {
            available: true,
            locked: true,
          },
          where: {
            userId: userId,
          },
        },
      },
      orderBy: {
        tickerSymbol: 'asc',
      },
    });

    return assets.map((asset) => {
      const userBalance = asset.userBalances.at(0);

      return {
        available: userBalance?.available.toNumber() ?? 0,
        locked: userBalance?.locked.toNumber() ?? 0,
        asset: {
          id: asset.id,
          logoUrl: asset.logoUrl,
          tickerSymbol: asset.tickerSymbol,
          fullName: asset.fullName,
        },
      };
    });
  }
}
