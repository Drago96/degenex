import { UserRole } from '.prisma/client';

import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const UserResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  roles: z.array(z.nativeEnum(UserRole)),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
