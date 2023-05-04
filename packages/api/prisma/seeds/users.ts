import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const seedUsers = async (prisma: PrismaClient) => {
  await prisma.user.upsert({
    where: { email: 'dragproychev@gmail.com' },
    update: {},
    create: {
      email: 'dragproychev@gmail.com',
      password: await bcrypt.hash('TestAdminPassword1!', 10),
      roles: ['Admin'],
    },
  });

  await prisma.user.upsert({
    where: { email: 'dr.proychev@gmail.com' },
    update: {},
    create: {
      email: 'dr.proychev@gmail.com',
      password: await bcrypt.hash('TestUserPassword1!', 10),
      roles: [],
    },
  });

  console.log('Seeded users...');
};
