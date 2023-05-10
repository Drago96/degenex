import { createZodDto } from 'nestjs-zod';

import { LoginSchema } from '@degenex/common';

export class LoginDto extends createZodDto(LoginSchema) {}
