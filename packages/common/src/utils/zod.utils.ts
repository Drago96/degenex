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
    z.custom<T>(() => true)
  );
