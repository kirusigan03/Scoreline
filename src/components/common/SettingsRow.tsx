import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';
import { AppText } from './AppText';

export interface SettingsRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  destructive?: boolean;
  style?: ViewStyle;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  rightElement,
  showChevron = true,
  destructive = false,
  style,
}) => {
  const { colors, radii } = useTheme();

  const isInteractive = Boolean(onPress);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!isInteractive}
      onPress={onPress}
      accessible={true}
      accessibilityRole={isInteractive ? 'button' : 'text'}
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ''}`}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: radii.card,
        },
        style,
      ]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: destructive
              ? colors.error + '15'
              : colors.accentSurface,
          },
        ]}>
        <Feather
          name={icon}
          size={18}
          color={destructive ? colors.error : colors.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <AppText
          variant="cardTitle"
          style={{ color: destructive ? colors.error : colors.textPrimary }}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" secondary style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="bodySmall" secondary style={styles.value}>
          {value}
        </AppText>
      ) : null}
      {rightElement ? (
        <View style={styles.rightElement}>{rightElement}</View>
      ) : isInteractive && showChevron ? (
        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    minHeight: 56,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  value: {
    marginRight: 8,
  },
  rightElement: {
    marginLeft: 8,
  },
});
