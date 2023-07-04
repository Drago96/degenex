import { PrismaClient } from '@prisma/client';

import { seedAssets } from './assets';
import { seedTradingPairs } from './trading-pairs';
import { seedUsers } from './users';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
  await seedAssets(prisma);
  await seedTradingPairs(prisma);

  console.log('Seeds finished!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
