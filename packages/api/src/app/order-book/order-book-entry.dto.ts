import { Decimal } from '@prisma/client/runtime';

export type OrderBookEntryDto = {
  orderId: number;
  remainingQuantity: Decimal | string;
};
