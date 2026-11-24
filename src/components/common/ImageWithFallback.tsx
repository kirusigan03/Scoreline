import React, { useState } from 'react';
import {
  View,
  Image,
  ImageProps,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';

export interface ImageWithFallbackProps extends Omit<ImageProps, 'source'> {
  uri?: string | null;
  fallbackIcon?: string;
  fallbackIconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  uri,
  fallbackIcon = 'shield',
  fallbackIconSize = 28,
  containerStyle,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(Boolean(uri));
  const [error, setError] = useState(!uri);

  const hasValidUri = Boolean(uri && uri.trim().length > 0 && !error);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }, containerStyle]}>
      {hasValidUri ? (
        <>
          <Image
            source={{ uri: uri! }}
            style={[styles.image, style]}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
            resizeMode="contain"
            {...props}
          />
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null}
        </>
      ) : (
        <View style={styles.fallback}>
          <Feather name={fallbackIcon} size={fallbackIconSize} color={colors.textMuted} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
});
