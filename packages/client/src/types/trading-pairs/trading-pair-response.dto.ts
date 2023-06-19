import { z } from "nestjs-zod/z";

import { TradingPairResponseSchema } from "@degenex/common";

export type TradingPairReponseDto = z.infer<typeof TradingPairResponseSchema>;
