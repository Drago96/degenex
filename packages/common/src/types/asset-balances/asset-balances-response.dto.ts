import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'nestjs-zod/z';

export const AssetBalancesResponseSchema = z.object({
  id: z.number(),
  logoUrl: z.string().nullable(),
  tickerSymbol: z.string(),
  fullName: z.string(),
  userBalance: z.number(),
});

export class AssetBalancesResponseDto extends createZodDto(
  AssetBalancesResponseSchema
) {}
