import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'nestjs-zod/z';

export const AssetBalanceResponseSchema = z.object({
  available: z.number(),
  locked: z.number(),
  asset: z.object({
    id: z.number(),
    logoUrl: z.string(),
    tickerSymbol: z.string(),
    fullName: z.string(),
  }),
});

export class AssetBalanceResponseDto extends createZodDto(
  AssetBalanceResponseSchema,
) {}
