import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme, useThemeController } from '../../theme';
import { AppText } from './AppText';

export interface ThemeToggleProps {
  style?: ViewStyle;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { colors, isDark, radii } = useTheme();
  const { setThemeMode } = useThemeController();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.chip,
        },
        style,
      ]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setThemeMode('light')}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Switch to Light Theme"
        accessibilityState={{ selected: !isDark }}
        style={[
          styles.option,
          !isDark && [
            styles.selectedOption,
            { backgroundColor: colors.accentSurface, borderColor: colors.primary },
          ],
        ]}>
        <Feather
          name="sun"
          size={16}
          color={!isDark ? colors.primary : colors.textMuted}
          style={styles.icon}
        />
        <AppText
          variant="caption"
          style={{
            color: !isDark ? colors.primary : colors.textMuted,
            fontWeight: !isDark ? '700' : '500',
          }}>
          Light
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setThemeMode('dark')}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Switch to Dark Theme"
        accessibilityState={{ selected: isDark }}
        style={[
          styles.option,
          isDark && [
            styles.selectedOption,
            { backgroundColor: colors.accentSurface, borderColor: colors.primary },
          ],
        ]}>
        <Feather
          name="moon"
          size={16}
          color={isDark ? colors.primary : colors.textMuted}
          style={styles.icon}
        />
        <AppText
          variant="caption"
          style={{
            color: isDark ? colors.primary : colors.textMuted,
            fontWeight: isDark ? '700' : '500',
          }}>
          Dark
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {},
  icon: {
    marginRight: 6,
  },
});
