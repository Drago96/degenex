import { Decimal } from '@prisma/client/runtime/library';

export type OrderBookEntryDto = {
  orderId: number;
  remainingQuantity: Decimal | string;
};
