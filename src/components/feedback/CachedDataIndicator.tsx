import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';
import { AppText } from '../common/AppText';

export interface CachedDataIndicatorProps {
  timestamp?: number | string | null;
  style?: ViewStyle;
}

export const CachedDataIndicator: React.FC<CachedDataIndicatorProps> = ({
  timestamp,
  style,
}) => {
  const { colors, radii } = useTheme();

  if (!timestamp) return null;

  const formattedTime =
    typeof timestamp === 'number'
      ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : timestamp;

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
      <Feather name="clock" size={13} color={colors.textSecondary} style={styles.icon} />
      <AppText variant="caption" secondary style={styles.text}>
        Saved data: {formattedTime}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginVertical: 8,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12,
  },
});
