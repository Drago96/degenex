import { AssetType, PrismaClient } from '@prisma/client';

export const seedTradingPairs = async (prisma: PrismaClient) => {
  const tradeableAssets = await prisma.asset.findMany({
    select: { tickerSymbol: true },
    where: { type: { in: [AssetType.Crypto, AssetType.Stock] } },
  });

  const fiatCurrencies = await prisma.asset.findMany({
    select: { tickerSymbol: true },
    where: { type: AssetType.FiatMoney },
  });

  tradeableAssets.forEach((tradeableAsset) => {
    fiatCurrencies.forEach(async (fiatCurrency) => {
      await prisma.tradingPair.upsert({
        where: {
          baseAssetTickerSymbol_quoteAssetTickerSymbol: {
            baseAssetTickerSymbol: tradeableAsset.tickerSymbol,
            quoteAssetTickerSymbol: fiatCurrency.tickerSymbol,
          },
        },
        update: {},
        create: {
          baseAssetTickerSymbol: tradeableAsset.tickerSymbol,
          quoteAssetTickerSymbol: fiatCurrency.tickerSymbol,
        },
      });
    });
  });

  console.log('Seeded trading pairs...');
};
