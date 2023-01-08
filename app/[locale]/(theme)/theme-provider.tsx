"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { Theme } from "@mui/system";
import { useState } from "react";

import { darkTheme, lightTheme } from "./themes";
import { ThemeContext, ThemeType } from "./theme-context";

export interface ThemeProviderProps {
  children: React.ReactNode;
}

const THEME_BY_TYPE: Record<ThemeType, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeType>("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MuiThemeProvider theme={THEME_BY_TYPE[theme]}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
