import * as Joi from 'joi';

export interface EnvironmentVariables {
  PORT: number;
  JWT_SECRET: string;
  DATABASE_URL: string;
}

export const validationSchema = Joi.object({
  PORT: Joi.number().greater(0).max(65535).required(),
  JWT_SECRET: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
});
