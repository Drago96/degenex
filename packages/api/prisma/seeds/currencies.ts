import { PrismaClient } from '@prisma/client';

export const seedCurrencies = async (prisma: PrismaClient) => {
  await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      fullName: 'United States Dollar',
    },
  });

  console.log('Seeded currencies...');
};
