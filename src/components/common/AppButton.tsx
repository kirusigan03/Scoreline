import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'normal' | 'small';
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  size = 'normal',
  ...props
}) => {
  const { colors, radii, spacing } = useTheme();

  const isSmall = size === 'small';
  const minHeight = isSmall ? 40 : 52;
  const paddingHorizontal = isSmall ? spacing.base : spacing.xl;

  let backgroundColor: string = colors.primary;
  let textColor: string = colors.primaryTextOnAccent;
  let borderColor: string | undefined;

  switch (variant) {
    case 'primary':
      backgroundColor = colors.primary;
      textColor = colors.primaryTextOnAccent;
      break;
    case 'secondary':
      backgroundColor = colors.card;
      textColor = colors.textPrimary;
      borderColor = colors.border;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = colors.primary;
      borderColor = colors.primary;
      break;
    case 'ghost':
      backgroundColor = 'transparent';
      textColor = colors.textPrimary;
      break;
    case 'danger':
      backgroundColor = colors.error;
      textColor = '#FFFFFF';
      break;
  }

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.button,
        {
          minHeight,
          paddingHorizontal,
          backgroundColor,
          borderRadius: radii.button,
          borderColor,
          borderWidth: borderColor ? 1.5 : 0,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <AppText
            variant={isSmall ? 'bodyBold' : 'button'}
            style={[{ color: textColor }, textStyle]}>
            {title}
          </AppText>
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
});
