import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const seedUsers = async (prisma: PrismaClient) => {
  await prisma.user.upsert({
    where: { email: 'dragproychev@gmail.com' },
    update: {},
    create: {
      email: 'dragproychev@gmail.com',
      password: await hashPassword('TestAdminPassword1!'),
      roles: ['Admin'],
      status: 'Active',
    },
  });

  await prisma.user.upsert({
    where: { email: 'dr.proychev@gmail.com' },
    update: {},
    create: {
      email: 'dr.proychev@gmail.com',
      password: await hashPassword('TestUserPassword1!'),
      roles: [],
      status: 'Active',
    },
  });

  console.log('Seeded users...');
};

const hashPassword = async (password: string) => {
  const saltOrRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltOrRounds);

  return passwordHash;
};
