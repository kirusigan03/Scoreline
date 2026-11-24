import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';
import { AppText } from '../common/AppText';

export interface CategoryChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: string;
  style?: ViewStyle;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  style,
}) => {
  const { colors, radii } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Select ${label} category`}
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.accentSurface : colors.card,
          borderColor: selected ? colors.primary : colors.border,
          borderRadius: radii.chip,
        },
        style,
      ]}>
      {icon ? (
        <Feather
          name={icon}
          size={14}
          color={selected ? colors.primary : colors.textSecondary}
          style={styles.icon}
        />
      ) : null}
      <AppText
        variant="caption"
        style={{
          color: selected ? colors.primary : colors.textSecondary,
          fontWeight: selected ? '700' : '500',
        }}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    marginRight: 8,
    minHeight: 36,
  },
  icon: {
    marginRight: 6,
  },
});
