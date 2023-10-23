import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod/dto';

import { decimal } from '@degenex/common';

export const OrderBookEntrySchema = z.object({
  orderId: z.number(),
  userId: z.number(),
  price: decimal(),
  remainingQuantity: decimal(),
});

export class OrderBookEntryDto extends createZodDto(OrderBookEntrySchema) {}
