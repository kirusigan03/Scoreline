import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface SkeletonBoxProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const { colors } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.box,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.skeletonHighlight,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

export const TeamCardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const { colors, radii } = useTheme();

  return (
    <View
      style={[
        styles.teamCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: radii.card,
        },
        style,
      ]}>
      <SkeletonBox width={56} height={56} borderRadius={28} />
      <View style={styles.teamCardDetails}>
        <SkeletonBox width="60%" height={18} style={styles.spacingBottom} />
        <SkeletonBox width="40%" height={14} style={styles.spacingBottom} />
        <SkeletonBox width="30%" height={12} />
      </View>
      <SkeletonBox width={36} height={36} borderRadius={18} />
    </View>
  );
};

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <TeamCardSkeleton key={`skeleton-${index}`} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  teamCardDetails: {
    flex: 1,
    marginLeft: 16,
  },
  spacingBottom: {
    marginBottom: 8,
  },
});
