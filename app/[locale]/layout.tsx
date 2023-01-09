import { ReactNode } from "react";

import { getSession } from "lib/session";
import SessionProvider from "./(auth)/session-provider";
import ThemeProvider from "./(theme)/theme-provider";
import CssBaseline from "./(theme)/css-baseline";
import AppHeader from "./app-header";
import AppBody from "./app-body";
import LocaleProvider, { ALLOWED_LOCALES, Locale } from "./locale-provider";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

type LayoutProps = {
  children: ReactNode;
  params: {
    locale: Locale;
  };
};

export default async function Layout({
  children,
  params: { locale },
}: LayoutProps) {
  const session = await getSession();

  return (
    <html lang={locale}>
      <head />
      <body>
        <SessionProvider session={session}>
          {/* @ts-expect-error Server Component */}
          <LocaleProvider locale={locale}>
            <ThemeProvider>
              <CssBaseline />
              <AppHeader />
              <AppBody>{children}</AppBody>
            </ThemeProvider>
          </LocaleProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
