import { Decimal } from '@prisma/client/runtime/library';

export type OrderBookTradeDto = {
  price: Decimal,
  quantity: Decimal;
  makerOrder: {
    id: number;
    orderBookId: string;
    remainingQuantity: Decimal;
  };
};
