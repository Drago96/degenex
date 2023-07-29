import { Decimal } from '@prisma/client/runtime/library';

export type OrderBookLookupDto = {
  orderBookId: string;
  price: Decimal;
};
