import { createContext, useContext } from "react";

export type ThemeType = "light" | "dark";

type ThemeContextProps = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
});

export const useTheme = () => {
  return useContext(ThemeContext);
};
