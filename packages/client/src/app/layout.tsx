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
          <div className="flex min-h-screen flex-col dark:bg-gray-900">
            <Header />
            <main className="mx-auto w-full max-w-screen-xl grow px-2.5 py-20">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
