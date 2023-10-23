import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'nestjs-zod/z';

import { UserRole } from '@prisma/client';

export const UserResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  roles: z.array(z.nativeEnum(UserRole)),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
