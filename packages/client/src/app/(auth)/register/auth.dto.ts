import { z } from "nestjs-zod/z";

import { AuthSchema } from "@degenex/common";

export type AuthDto = z.infer<typeof AuthSchema>;
