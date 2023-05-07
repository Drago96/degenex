import "./globals.scss";

import { ReactNode } from "react";
import { Inter } from "next/font/google";

import Header from "./header";
import ThemeProvider from "./theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Degenex",
  description: "The online trading platform for degenerates",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <div className="min-h-screen px-2.5 py-2.5 dark:bg-gray-900">
            <main className="mx-auto max-w-screen-xl">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
