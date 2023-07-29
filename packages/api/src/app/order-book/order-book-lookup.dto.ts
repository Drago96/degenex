import { Decimal } from '@prisma/client/runtime';

export type OrderBookLookupDto = {
  orderBookId: string;
  price: Decimal;
};
