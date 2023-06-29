import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
}

export const EnvironmentVariablesSchema = z.object({
  NODE_ENV: z.nativeEnum(Environment),
  PORT: z.string().regex(/\d+/),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  DATABASE_URL: z.string(),
  REDIS_PORT: z.string().regex(/\d+/),
  REDIS_HOST: z.string(),
  AWS_REGION: z.string(),
  MAILER_SOURCE_EMAIL: z.string().email(),
  ENCRYPTION_PASSWORD: z.string(),
  RAPID_API_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
});

export class EnvironmentVariables extends createZodDto(
  EnvironmentVariablesSchema
) {}

export const validate = (config: Record<string, unknown>) => {
  return EnvironmentVariablesSchema.parse(config);
};
