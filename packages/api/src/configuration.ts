import { plainToInstance } from 'class-transformer';
import { IsEmail, IsEnum, IsNumber, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  JWT_SECRET: string;

  DATABASE_URL: string;

  @IsNumber()
  REDIS_PORT: number;
  REDIS_HOST: string;

  AWS_REGION: string;

  @IsEmail()
  MAILER_SOURCE_EMAIL: string;

  ENCRYPTION_PASSWORD: string;

  RAPID_API_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
