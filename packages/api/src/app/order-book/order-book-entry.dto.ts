import { Decimal } from '@prisma/client/runtime/library';

export type OrderBookEntryDto = {
  orderId: number;
  userId: number;
  remainingQuantity: Decimal | string;
};
