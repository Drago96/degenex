import { Decimal } from '@prisma/client/runtime';

export type OrderBookTradeDto = {
  makerOrderId: number;
  makerOrderBookId: string;
  quantity: Decimal;
  isMakerOrderFilled: boolean;
};
