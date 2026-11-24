import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';
import { AppText } from '../common/AppText';
import { AppButton } from '../common/AppButton';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: string;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading data. Please check your connection and try again.',
  onRetry,
  icon = 'alert-circle',
  style,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      accessible={true}
      accessibilityRole="alert"
      style={[styles.container, { padding: spacing.xxl }, style]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.error + '15' },
        ]}>
        <Feather name={icon} size={36} color={colors.error} />
      </View>
      <AppText variant="sectionTitle" center style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" secondary center style={styles.message}>
        {message}
      </AppText>
      {onRetry ? (
        <AppButton
          title="Try Again"
          variant="primary"
          onPress={onRetry}
          leftIcon={<Feather name="refresh-cw" size={16} color={colors.primaryTextOnAccent} />}
          style={styles.retryButton}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 24,
    maxWidth: 320,
  },
  retryButton: {
    minWidth: 160,
  },
});
