import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl/client";
import { notFound } from "next/navigation";

export const ALLOWED_LOCALES = ["en", "bg"] as const;

export type Locale = typeof ALLOWED_LOCALES[number];

type LocaleProviderProps = {
  children: ReactNode;
  locale: Locale;
};

export default async function LocaleProvider({
  children,
  locale,
}: LocaleProviderProps) {
  let messages;

  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
