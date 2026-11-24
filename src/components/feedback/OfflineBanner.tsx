import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';
import { AppText } from '../common/AppText';

export interface OfflineBannerProps {
  visible?: boolean;
  message?: string;
  style?: ViewStyle;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  visible = true,
  message = "You're offline — showing saved data.",
  style,
}) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={message}
      style={[
        styles.banner,
        {
          backgroundColor: colors.warning,
        },
        style,
      ]}>
      <Feather name="wifi-off" size={16} color="#101820" style={styles.icon} />
      <AppText
        variant="caption"
        style={styles.text}>
        {message}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#101820',
    fontWeight: '700',
  },
});
