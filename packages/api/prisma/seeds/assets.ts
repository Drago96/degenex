import { AssetType, PrismaClient } from '@prisma/client';

export const seedAssets = async (prisma: PrismaClient) => {
  await prisma.asset.upsert({
    where: { tickerSymbol: 'AAPL' },
    update: {},
    create: {
      tickerSymbol: 'AAPL',
      fullName: 'Apple',
      type: AssetType.Stock,
      logoUrl: `${process.env.CLOUDFRONT_URL}/logos/apple-logo.svg`,
    },
  });

  await prisma.asset.upsert({
    where: { tickerSymbol: 'MSFT' },
    update: {},
    create: {
      tickerSymbol: 'MSFT',
      fullName: 'Microsoft',
      type: AssetType.Stock,
      logoUrl: `${process.env.CLOUDFRONT_URL}/logos/microsoft-logo.svg`,
    },
  });

  await prisma.asset.upsert({
    where: { tickerSymbol: 'BTC' },
    update: {},
    create: {
      tickerSymbol: 'BTC',
      fullName: 'Bitcoin',
      type: AssetType.Crypto,
      logoUrl: `${process.env.CLOUDFRONT_URL}/logos/bitcoin-logo.svg`,
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
      logoUrl: `${process.env.CLOUDFRONT_URL}/logos/dollar-logo.svg`,
    },
  });

  console.log('Seeded assets...');
};
