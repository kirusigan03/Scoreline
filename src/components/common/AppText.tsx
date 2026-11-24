import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export type TextVariant =
  | 'display'
  | 'screenTitle'
  | 'sectionTitle'
  | 'cardTitle'
  | 'body'
  | 'bodyBold'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'button';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  secondary?: boolean;
  muted?: boolean;
  center?: boolean;
}

export const AppText: React.FC<AppTextProps> = ({
  children,
  variant = 'body',
  color,
  secondary,
  muted,
  center,
  style,
  ...props
}) => {
  const { colors, typography } = useTheme();

  const variantStyle = typography[variant] || typography.body;

  let resolvedColor = colors.textPrimary;
  if (color) {
    resolvedColor = color;
  } else if (secondary) {
    resolvedColor = colors.textSecondary;
  } else if (muted) {
    resolvedColor = colors.textMuted;
  }

  return (
    <Text
      allowFontScaling={true}
      maxFontSizeMultiplier={1.5}
      style={[
        styles.base,
        variantStyle,
        { color: resolvedColor },
        center && styles.center,
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
  center: {
    textAlign: 'center',
  },
});
