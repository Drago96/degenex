"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
});

type ThemeProviderProps = { children: ReactNode };

const THEME_KEY = "app-theme";

function getDefaultTheme(): Theme {
  const userSelectedTheme = localStorage.getItem(THEME_KEY) as Theme | null;

  if (userSelectedTheme !== null) {
    return userSelectedTheme;
  }

  const userPrefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (userPrefersDarkMode) {
    return "dark";
  }

  return "light";
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getDefaultTheme());

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (theme: Theme) => {
          localStorage.setItem(THEME_KEY, theme);

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
