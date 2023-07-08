import { AssetType, PrismaClient } from '@prisma/client';

export const seedAssets = async (prisma: PrismaClient) => {
  await prisma.asset.upsert({
    where: { tickerSymbol: 'AAPL' },
    update: {},
    create: {
      tickerSymbol: 'AAPL',
      fullName: 'Apple',
      type: AssetType.Stock,
      logoUrl: 'https://d1zd1ouamy16t4.cloudfront.net/logos/apple-logo.svg',
    },
  });

  await prisma.asset.upsert({
    where: { tickerSymbol: 'MSFT' },
    update: {},
    create: {
      tickerSymbol: 'MSFT',
      fullName: 'Microsoft',
      type: AssetType.Stock,
      logoUrl: 'https://d1zd1ouamy16t4.cloudfront.net/logos/microsoft-logo.svg',
    },
  });

  await prisma.asset.upsert({
    where: { tickerSymbol: 'BTC' },
    update: {},
    create: {
      tickerSymbol: 'BTC',
      fullName: 'Bitcoin',
      type: AssetType.Crypto,
      logoUrl: 'https://d1zd1ouamy16t4.cloudfront.net/logos/bitcoin-logo.svg',
    },
  });

  await prisma.asset.upsert({
    where: { tickerSymbol: 'USD' },
    update: {},
    create: {
      tickerSymbol: 'USD',
      fullName: 'United States Dollar',
      type: AssetType.FiatMoney,
      currencySymbol: '$',
      logoUrl: 'https://d1zd1ouamy16t4.cloudfront.net/logos/dollar-logo.svg',
    },
  });

  console.log('Seeded assets...');
};
