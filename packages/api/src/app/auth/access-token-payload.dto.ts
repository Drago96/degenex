import { createZodDto } from 'nestjs-zod';

import { AccessTokenPayloadSchema } from '@degenex/common';

export class AccessTokenPayloadDto extends createZodDto(
  AccessTokenPayloadSchema
) {}
