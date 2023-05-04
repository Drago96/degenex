import { PrismaClient } from '@prisma/client';

export const seedTradingPairs = async (prisma: PrismaClient) => {
  const assets = await prisma.asset.findMany({ select: { id: true } });
  const currencies = await prisma.currency.findMany({ select: { id: true } });

  assets.forEach((asset) => {
    currencies.forEach(async (currency) => {
      await prisma.tradingPair.upsert({
        where: {
          assetId_currencyId: { assetId: asset.id, currencyId: currency.id },
        },
        update: {},
        create: {
          assetId: asset.id,
          currencyId: currency.id,
        },
      });
    });
  });

  console.log('Seeded trading pairs...');
};
