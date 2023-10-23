import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { AssetType } from '@prisma/client';
import { withFallback } from '@degenex/common';

const AssetBalancesQuerySchema = z.object({
  assetType: withFallback(z.nativeEnum(AssetType).nullable(), null),
});

export class AssetBalancesQueryDto extends createZodDto(
  AssetBalancesQuerySchema,
) {}
