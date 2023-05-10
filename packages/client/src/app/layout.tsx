import "./globals.scss";

import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import Header from "./header";
import ThemeProvider, { Theme } from "./theme-provider";
import { Footer } from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Degenex",
  description: "The online trading platform for degenerates",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();

  const theme = cookieStore.get("theme")?.value as Theme | undefined;

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider defaultTheme={theme}>
          <div className="flex min-h-screen flex-col bg-background dark:bg-background-dark">
            <Header />
            <main className="mx-auto w-full max-w-screen-xl grow px-2.5 py-20">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
