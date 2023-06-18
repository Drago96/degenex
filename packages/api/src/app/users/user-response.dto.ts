import { createZodDto } from 'nestjs-zod';

import { UserResponseSchema } from '@degenex/common';

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
