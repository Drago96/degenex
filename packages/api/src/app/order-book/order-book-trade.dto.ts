import { Decimal } from '@prisma/client/runtime';

export type OrderBookTradeDto = {
  quantity: Decimal;
  makerOrder: {
    id: number;
    orderBookId: string;
    remainingQuantity: Decimal;
  };
};
