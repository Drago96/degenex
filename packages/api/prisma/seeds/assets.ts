import { AssetType, PrismaClient } from '@prisma/client';

export const seedAssets = async (prisma: PrismaClient) => {
  await prisma.asset.upsert({
    where: { tickerSymbol: 'AAPL' },
    update: {},
    create: {
      tickerSymbol: 'AAPL',
      fullName: 'Apple',
      type: AssetType.Stock,
    },
  });

  await prisma.asset.upsert({
    where: { tickerSymbol: 'MSFT' },
    update: {},
    create: {
      tickerSymbol: 'MSFT',
      fullName: 'Microsoft',
      type: AssetType.Stock,
    },
  });

  await prisma.asset.upsert({
    where: { tickerSymbol: 'BTC' },
    update: {},
    create: {
      tickerSymbol: 'BTC',
      fullName: 'Bitcoin',
      type: AssetType.Crypto,
    },
  });

  console.log('Seeded assets...');
};