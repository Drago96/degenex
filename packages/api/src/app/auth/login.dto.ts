import { createZodDto } from 'nestjs-zod';

import { AuthSchema } from '@degenex/common';

export class LoginDto extends createZodDto(AuthSchema) {}
