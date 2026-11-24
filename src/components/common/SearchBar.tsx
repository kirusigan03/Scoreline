import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search teams or leagues...',
  onClear,
  style,
}) => {
  const { colors, radii, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBackground,
          borderColor: colors.border,
          borderRadius: radii.input,
        },
        style,
      ]}>
      <Feather name="search" size={18} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        allowFontScaling={true}
        maxFontSizeMultiplier={1.3}
        style={[
          styles.input,
          typography.body,
          { color: colors.textPrimary },
        ]}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            onChangeText('');
            onClear && onClear();
          }}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearButton}>
          <Feather name="x" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  clearButton: {
    padding: 4,
  },
});
