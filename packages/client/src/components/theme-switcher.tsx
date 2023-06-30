"use client";

import { MdDarkMode, MdLightMode } from "react-icons/md";

import Button from "./ui/button";
import { useTheme } from "./theme-provider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
    </Button>
  );
}
