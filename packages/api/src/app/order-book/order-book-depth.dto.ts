import { Decimal } from "@prisma/client/runtime/library";

export type OrderBookDepthDto = {
  price: Decimal;
  quantity: Decimal;
};
