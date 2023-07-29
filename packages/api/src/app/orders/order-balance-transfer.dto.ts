import { OrderSide } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export type OrderBalanceTransferDto = {
  userId: number;
  orderSide: OrderSide;
  baseAsset: {
    tickerSymbol: string;
    quantity: Decimal;
  };
  quoteAsset: {
    tickerSymbol: string;
    amount: Decimal;
  };
};
