import { AssetType, PrismaClient } from '@prisma/client';

export const seedTradingPairs = async (prisma: PrismaClient) => {
  const tradeableAssets = await prisma.asset.findMany({
    select: { id: true },
    where: { type: { in: [AssetType.Crypto, AssetType.Stock] } },
  });

  const fiatCurrencies = await prisma.asset.findMany({
    select: { id: true },
    where: { type: AssetType.FiatMoney },
  });

  tradeableAssets.forEach((tradeableAsset) => {
    fiatCurrencies.forEach(async (fiatCurrency) => {
      await prisma.tradingPair.upsert({
        where: {
          baseAssetId_quoteAssetId: {
            baseAssetId: tradeableAsset.id,
            quoteAssetId: fiatCurrency.id,
          },
        },
        update: {},
        create: {
          baseAssetId: tradeableAsset.id,
          quoteAssetId: fiatCurrency.id,
        },
      });
    });
  });

  console.log('Seeded trading pairs...');
};
