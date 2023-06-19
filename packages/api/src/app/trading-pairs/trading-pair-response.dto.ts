import { createZodDto } from 'nestjs-zod';

import { TradingPairResponseSchema } from '@degenex/common';

export class TradingPairResponseDto extends createZodDto(
  TradingPairResponseSchema
) {}
