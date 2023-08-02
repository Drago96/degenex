import { Decimal } from '@prisma/client/runtime/library';

export type OrderBookEntryDto = {
  orderId: number;
  userId: number;
  price: Decimal | string;
  remainingQuantity: Decimal | string;
};
