"use client";

import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useTheme } from "./theme-context";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <IconButton onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" && <DarkMode />}
      {theme === "dark" && <LightMode />}
    </IconButton>
  );
}
