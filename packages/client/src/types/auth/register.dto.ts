import { z } from "nestjs-zod/z";

import { RegisterSchema } from "@degenex/common";

export type RegisterDto = z.infer<typeof RegisterSchema>;
