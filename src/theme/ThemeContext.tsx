import { createContext, useContext } from 'react';
import { Theme, darkTheme, ThemeMode } from './themes';

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: darkTheme,
  themeMode: 'dark',
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    return darkTheme;
  }
  return context.theme;
};

export const useThemeController = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeController must be used within a ThemeProvider');
  }
  return context;
};
