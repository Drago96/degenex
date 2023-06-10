import { z } from "nestjs-zod/z";

import { AuthResponseSchema } from "@degenex/common";

export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;
