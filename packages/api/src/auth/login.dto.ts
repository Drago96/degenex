import { createZodDto } from 'nestjs-zod';

import { LoginSchema } from 'common/auth/login.schema';

export class LoginDto extends createZodDto(LoginSchema) {}
