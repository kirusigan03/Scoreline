import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { AppTextInput, AppTextInputProps } from './AppTextInput';
import { useTheme } from '../../theme';

export interface PasswordInputProps extends Omit<AppTextInputProps, 'secureTextEntry' | 'rightIcon'> {
  showPasswordToggle?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showPasswordToggle = true,
  ...props
}) => {
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = useState(true);

  const toggleSecure = () => {
    setIsSecure(prev => !prev);
  };

  const rightIcon = showPasswordToggle ? (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={toggleSecure}
      accessibilityRole="button"
      accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={styles.iconButton}>
      <Feather
        name={isSecure ? 'eye-off' : 'eye'}
        size={20}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  ) : undefined;

  return (
    <AppTextInput
      secureTextEntry={isSecure}
      rightIcon={rightIcon}
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
