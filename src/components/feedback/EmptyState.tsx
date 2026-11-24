import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';
import { AppText } from '../common/AppText';
import { AppButton } from '../common/AppButton';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionText,
  onAction,
  style,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xxl }, style]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.accentSurface },
        ]}>
        <Feather name={icon} size={36} color={colors.primary} />
      </View>
      <AppText variant="sectionTitle" center style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" secondary center style={styles.description}>
        {description}
      </AppText>
      {actionText && onAction ? (
        <AppButton
          title={actionText}
          variant="primary"
          onPress={onAction}
          style={styles.actionBtn}
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
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    maxWidth: 300,
  },
  actionBtn: {
    minWidth: 180,
  },
});
