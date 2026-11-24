import React, { useEffect, useRef, useCallback } from 'react';
import { Animated, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';
import { AppText } from '../common/AppText';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarProps {
  visible: boolean;
  message: string;
  type?: SnackbarType;
  onDismiss: () => void;
  duration?: number;
  style?: ViewStyle;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  visible,
  message,
  type = 'info',
  onDismiss,
  duration = 3000,
  style,
}) => {
  const { colors, radii } = useTheme();
  const translateY = useRef(new Animated.Value(-80)).current;

  const hide = useCallback(() => {
    Animated.timing(translateY, {
      toValue: -80,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  }, [translateY, onDismiss]);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      const timer = setTimeout(() => {
        hide();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hide();
    }
  }, [visible, duration, hide, translateY]);

  let iconName = 'info';
  let accentColor = colors.primary;

  switch (type) {
    case 'success':
      iconName = 'check-circle';
      accentColor = colors.success;
      break;
    case 'error':
      iconName = 'alert-triangle';
      accentColor = colors.error;
      break;
    case 'warning':
      iconName = 'alert-circle';
      accentColor = colors.warning;
      break;
    case 'info':
      iconName = 'info';
      accentColor = colors.primary;
      break;
  }

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: accentColor,
          borderRadius: radii.card,
          transform: [{ translateY }],
        },
        style,
      ]}>
      <Feather name={iconName} size={20} color={accentColor} style={styles.icon} />
      <AppText variant="bodySmall" style={styles.text} numberOfLines={2}>
        {message}
      </AppText>
      <TouchableOpacity onPress={hide} style={styles.closeBtn}>
        <Feather name="x" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.5,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontWeight: '600',
  },
  closeBtn: {
    marginLeft: 8,
    padding: 4,
  },
});
