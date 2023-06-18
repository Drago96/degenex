import { z } from 'nestjs-zod/z';

import { UserRole } from '../users';

export const AccessTokenPayloadSchema = z.object({
  sub: z.number(),
  email: z.string().email(),
  roles: z.array(z.nativeEnum(UserRole)),
});
