import "./globals.scss";
import "react-toastify/dist/ReactToastify.css";

import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Metadata } from "next";

import Header from "@/components/header";
import ThemeProvider, { Theme } from "@/components/theme-provider";
import Footer from "@/components/footer";
import ToastContainer from "@/components/toast-container";
import IconContextProvider from "@/components/icon-context-provider";
import QueryClientProvider from "@/components/query-client-provider";

export const metadata: Metadata = {
  title: "Degenex",
  description: "The online trading platform for degenerates",
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookiesStore = cookies();

  const theme = cookiesStore.get("theme")?.value as Theme | undefined;

  return (
    <html lang="en" className={inter.className}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme={theme}>
          <IconContextProvider>
            <QueryClientProvider>
              <div className="flex min-h-screen flex-col bg-background dark:bg-background-dark">
                <Header />
                <main className="mx-auto w-full max-w-screen-xl grow px-2.5 py-20">
                  {children}
                </main>
                <Footer />
              </div>
              <ToastContainer theme={theme} />
            </QueryClientProvider>
          </IconContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
