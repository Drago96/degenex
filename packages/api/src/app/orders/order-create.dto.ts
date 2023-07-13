import { z } from 'nestjs-zod/z';

import { OrderSide, OrderType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod/dto';

export const OrderCreateSchema = z.object({
  side: z.nativeEnum(OrderSide),
  type: z.nativeEnum(OrderType),
  quantity: z.number().gt(0),
  price: z.number().gt(0),
  tradingPairId: z.number(),
});

export class OrderCreateDto extends createZodDto(OrderCreateSchema) {}
