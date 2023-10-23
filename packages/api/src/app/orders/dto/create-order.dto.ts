import { z } from 'nestjs-zod/z';

import { OrderSide, OrderType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod/dto';
import { decimal } from '@degenex/common';

export const CreateOrderSchema = z.object({
  side: z.nativeEnum(OrderSide),
  type: z.nativeEnum(OrderType),
  quantity: decimal((z) => z.gt(0)),
  price: decimal((z) => z.gt(0)),
  tradingPairId: z.number(),
});

export class CreateOrderDto extends createZodDto(CreateOrderSchema) {}
