import { createZodDto } from 'nestjs-zod';

import { RegisterSchema } from '@degenex/common';

export class RegisterDto extends createZodDto(RegisterSchema) {}
