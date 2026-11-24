import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './AppText';

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  hint?: string;
}

export const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  hint,
  onFocus,
  onBlur,
  ...props
}) => {
  const { colors, radii, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.borderFocus
    : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <AppText variant="label" style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBackground,
            borderRadius: radii.input,
            borderColor,
          },
        ]}>
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          allowFontScaling={true}
          maxFontSizeMultiplier={1.3}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            typography.body,
            { color: colors.textPrimary },
            inputStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <AppText variant="caption" style={[styles.errorText, { color: colors.error }]}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" style={[styles.hintText, { color: colors.textMuted }]}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderWidth: 1.5,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 8,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
  },
  hintText: {
    marginTop: 6,
    marginLeft: 4,
  },
});
