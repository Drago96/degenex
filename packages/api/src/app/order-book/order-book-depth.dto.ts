import { Decimal } from '@prisma/client/runtime';

export type OrderBookDepthDto = {
  price: Decimal;
  quantity: Decimal;
};
