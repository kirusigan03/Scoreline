import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { AppText } from './AppText';

export interface AvatarProps {
  name: string;
  uri?: string | null;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  uri,
  size = 48,
  style,
}) => {
  const { colors } = useTheme();

  const getInitials = (text: string): string => {
    if (!text) return 'SC';
    const parts = text.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.accentSurface,
          borderColor: colors.border,
        },
        style,
      ]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <AppText
          variant="label"
          style={{
            fontSize: size * 0.38,
            color: colors.primary,
            fontWeight: '700',
          }}>
          {initials}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
  },
});
