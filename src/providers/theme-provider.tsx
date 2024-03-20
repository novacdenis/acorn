"use client";

import type { Theme } from "@/types";

import React from "react";
import { setUserTheme } from "@/features/auth";

const disableAnimations = () => {
  const css = document.createElement("style");
  css.appendChild(
    document.createTextNode(
      `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
    )
  );
  document.head.appendChild(css);

  return () => {
    (() => window.getComputedStyle(document.body))();
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

interface ThemeProviderContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeProviderContext = React.createContext({} as ThemeProviderContextValue);
export const useTheme = () => React.useContext(ThemeProviderContext);

export interface ThemeProviderProps {
  defaultTheme: Theme;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ defaultTheme, children }) => {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);

  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    const enableAnimations = disableAnimations();

    setTheme(newTheme);
    setUserTheme(newTheme);
    document.documentElement.style.colorScheme = newTheme;
    document.documentElement.classList.replace(theme, newTheme);
    enableAnimations();
  }, [theme]);

  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
};
