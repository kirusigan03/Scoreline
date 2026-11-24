import settingsReducer, {
  setTheme,
  toggleThemeMode,
} from '../src/features/settings/settingsSlice';
import { darkColors, lightColors } from '../src/theme';

describe('Theme Preferences and Design Tokens', () => {
  it('should default to Dark mode according to Scoreline brand identity', () => {
    const state = settingsReducer(undefined, { type: '@@INIT' });
    expect(state.themeMode).toBe('dark');
  });

  it('should toggle theme from dark to light and back', () => {
    const initialState = { themeMode: 'dark' as const };
    const step1 = settingsReducer(initialState, toggleThemeMode());
    expect(step1.themeMode).toBe('light');

    const step2 = settingsReducer(step1, toggleThemeMode());
    expect(step2.themeMode).toBe('dark');
  });

  it('should set theme explicitly', () => {
    const initialState = { themeMode: 'dark' as const };
    const updated = settingsReducer(initialState, setTheme('light'));
    expect(updated.themeMode).toBe('light');
  });

  it('should maintain verified contrast tokens in both themes', () => {
    // Dark theme check
    expect(darkColors.background).toBe('#101820');
    expect(darkColors.primary).toBe('#C5F451');
    expect(darkColors.textPrimary).toBe('#F8FAFC');

    // Light theme check
    expect(lightColors.background).toBe('#F8FAFC');
    expect(lightColors.primary).toBe('#365314');
    expect(lightColors.textPrimary).toBe('#101820');

    // Light theme must not use white text on light surface
    expect(lightColors.textPrimary).not.toBe('#FFFFFF');
  });
});
