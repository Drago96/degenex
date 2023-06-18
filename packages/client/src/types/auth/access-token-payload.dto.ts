import { z } from "nestjs-zod/z";

import { AccessTokenPayloadSchema } from "@degenex/common";

export type AccessTokenPayloadSchema = z.infer<typeof AccessTokenPayloadSchema>;
