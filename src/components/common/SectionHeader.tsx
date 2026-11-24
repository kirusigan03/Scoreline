import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './AppText';

export interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onActionPress,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <AppText variant="sectionTitle">{title}</AppText>
      {actionText && onActionPress ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={actionText}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <AppText variant="label" style={{ color: colors.primary }}>
            {actionText}
          </AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
