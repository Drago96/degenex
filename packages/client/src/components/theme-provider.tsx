"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import cookies from "js-cookie";

export type Theme = "light" | "dark";

type ThemeContextProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => void 0,
});

type ThemeProviderProps = { children: ReactNode; defaultTheme?: Theme };

export default function ThemeProvider({
  children,
  defaultTheme,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme || "light");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (theme: Theme) => {
          cookies.set("theme", theme, { expires: 365 });

          setTheme(theme);
        },
      }}
    >
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
