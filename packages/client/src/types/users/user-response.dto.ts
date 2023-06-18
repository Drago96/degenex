import { z } from "nestjs-zod/z";

import { UserResponseSchema } from "@degenex/common";

export type UserResponseDto = z.infer<typeof UserResponseSchema>;
