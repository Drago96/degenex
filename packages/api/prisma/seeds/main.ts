import { PrismaClient } from '@prisma/client';

import { seedUsers } from './users';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);

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
