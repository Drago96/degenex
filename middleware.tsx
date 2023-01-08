import { createIntlMiddleware } from "next-intl/server";

import { ALLOWED_LOCALES } from "app/[locale]/locale-provider";

export default createIntlMiddleware({
  locales: ALLOWED_LOCALES as any as string[],
  defaultLocale: "en",
});
