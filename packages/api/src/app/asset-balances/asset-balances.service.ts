import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';

import { PrismaService } from '@/prisma/prisma.service';
import { AssetType } from '@prisma/client';

@Injectable()
export class AssetBalancesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMany(userId: number, assetType?: AssetType) {
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
            amount: true,
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

    return assets.map((asset) => ({
      ...omit(asset, 'userBalances'),
      userBalance: asset.userBalances.at(0)?.amount?.toNumber() ?? 0,
    }));
  }
}
