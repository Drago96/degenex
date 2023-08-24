import { Decimal } from 'decimal.js';
import { z } from 'nestjs-zod/z';

export const withFallback = <T>(schema: z.ZodType<T>, fallback: T) =>
  z.preprocess(
    (value) => {
      const parseResult = schema.safeParse(value);

      if (parseResult.success) {
        return value;
      }

      return fallback;
    },
    z.custom<T>(() => true),
  );

export const decimal = (
  applyValidations: (z: z.ZodNumber) => z.ZodNumber = (z) => z,
) =>
  applyValidations(z.coerce.number())
    .refine((value) => {
      try {
        return new Decimal(value);
      } catch (error) {
        return false;
      }
    })
    .transform((value) => new Decimal(value));
