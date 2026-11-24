import { ColorPalette, darkColors, lightColors } from './colors';
import { spacing, Spacing } from './spacing';
import { typography } from './typography';
import { radii, Radii } from './radii';

export type ThemeMode = 'dark' | 'light';

export interface Theme {
  mode: ThemeMode;
  colors: ColorPalette;
  spacing: Spacing;
  typography: typeof typography;
  radii: Radii;
  isDark: boolean;
}

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  spacing,
  typography,
  radii,
  isDark: true,
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  spacing,
  typography,
  radii,
  isDark: false,
};
