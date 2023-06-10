import { createZodDto } from 'nestjs-zod';

import { AuthResponseSchema } from '@degenex/common';

export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}
