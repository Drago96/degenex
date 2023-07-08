import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'nestjs-zod/z';

export const AssetBalanceResponseSchema = z.object({
  id: z.number(),
  logoUrl: z.string(),
  tickerSymbol: z.string(),
  fullName: z.string(),
  userBalance: z.number(),
});

export class AssetBalanceResponseDto extends createZodDto(
  AssetBalanceResponseSchema
) {}
