import { PrismaClient } from '@prisma/client';

export type PrismaTransaction = Omit<
  PrismaClient,
  '$on' | '$connect' | '$disconnect' | '$transaction' | '$use' | '$extends'
>;
